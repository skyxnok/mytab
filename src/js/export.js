// encrypt.js - Tab/XXTEA 最终升级版（修复setUint64兼容性）
// 头部格式：
// 0~7  字节：时间戳 timestamp (uint64, little-endian)
// 8~23 字节：随机16字节密钥
// 24~27字节：随机delta (uint32, little-endian)
// 28字节以后：加密数据

const xxteaTools = {
    decrypt(data, key, delta, padding, rounds) {
        const dLen = data.length;
        const kLen = key.length;

        if (kLen !== 16) {
            throw new Error("need a 16-byte key");
        }

        if (!padding && (dLen < 8 || (dLen & 3) !== 0)) {
            throw new Error(
                "data length must be a multiple of 4 bytes and must not be less than 8 bytes"
            );
        }
        if ((dLen & 3) !== 0 || dLen < 8) {
            throw new Error(
                "invalid data, data length is not a multiple of 4, or less than 8 bytes"
            );
        }

        const aLen = dLen / 4;
        const dArr = byteTools.bytesToUint32(data, dLen, aLen, false);
        const kArr = byteTools.bytesToUint32(key, kLen, 4, false);

        this.btea(dArr, -aLen, kArr, delta, rounds);

        const refBuf = byteTools.uint32sToBytes(dArr, aLen, padding);
        const rc = refBuf.length;

        if (padding) {
            if (rc >= 0) {
                return refBuf.subarray(0, rc);
            } else {
                throw new Error("invalid PKCS#7 padding, wrong key or corrupted data");
            }
        }
        return refBuf;
    },

    encrypt(data, key, delta, padding, rounds) {
        const dLen = data.length;
        const kLen = key.length;
        let paddingValue = padding ? 1 : 0;

        if (kLen !== 16) {
            throw new Error("need a 16-byte key");
        }

        if (!padding && (dLen < 8 || (dLen & 3) !== 0)) {
            throw new Error(
                "data length must be a multiple of 4 bytes and must not be less than 8 bytes"
            );
        }

        let aLen;
        if (dLen < 4) {
            aLen = 2;
        } else {
            aLen = (dLen >> 2) + paddingValue;
        }

        const dArr = byteTools.bytesToUint32(data, dLen, aLen, padding);
        const kArr = byteTools.bytesToUint32(key, kLen, 4, false);

        return byteTools.uint32sToBytes(this.btea(dArr, aLen, kArr, delta, rounds), aLen, false);
    },

    btea(v, n, key, delta, rounds) {
        let i, y, z, p, e, sum = 0;

        if (n > 1) {
            const un = n >>> 0;
            rounds = rounds || Math.floor(6 + 52 / un);
            z = v[un - 1];

            for (i = 0; i < rounds; i++) {
                sum += delta;
                e = (sum >>> 2) & 3;
                for (p = 0; p < un - 1; p++) {
                    y = v[p + 1];
                    const mm = this.mx(y, z, p, e, sum, key);
                    v[p] += mm;
                    z = v[p];
                }
                y = v[0];
                const mn = this.mx(y, z, p, e, sum, key);
                v[un - 1] += mn;
                z = v[un - 1];
            }
        } else if (n < -1) {
            const un = -n >>> 0;
            rounds = rounds || Math.floor(6 + 52 / un);
            sum = rounds * delta;
            y = v[0];

            for (i = 0; i < rounds; i++) {
                e = (sum >>> 2) & 3;
                for (p = un - 1; p > 0; p--) {
                    z = v[p - 1];
                    v[p] -= this.mx(y, z, p, e, sum, key);
                    y = v[p];
                }
                z = v[un - 1];
                v[0] -= this.mx(y, z, p, e, sum, key);
                y = v[0];
                sum -= delta;
            }
        }
        return v;
    },

    mx(y, z, p, e, sum, key) {
        return (
            (((z >>> 5) ^ (y << 2)) + ((y >>> 3) ^ (z << 4))) ^
            ((sum ^ y) + (key[(p & 3) ^ e] ^ z))
        );
    },
};

const byteTools = {
    bytesToUint32(data, inLen, outLen, padding) {
        const out = new Array(outLen).fill(0);
        for (let i = 0; i < inLen; i++) {
            out[i >>> 2] |= ((data[i] & 0xff) << ((i & 3) << 3));
        }
        if (padding) {
            let pad = 4 - (inLen & 3);
            if (inLen < 4) pad += 4;
            for (let i = inLen; i < inLen + pad; i++) {
                out[i >>> 2] |= (pad << ((i & 3) << 3));
            }
        }
        return Uint32Array.from(out);
    },

    uint32sToBytes(inArr, inLen, padding) {
        inLen = inLen || inArr.length;
        const out = new Array(inLen * 4);
        for (let i = 0; i < inLen; i++) {
            const idx = i * 4;
            out[idx] = inArr[i] & 0xff;
            out[idx + 1] = (inArr[i] >>> 8) & 0xff;
            out[idx + 2] = (inArr[i] >>> 16) & 0xff;
            out[idx + 3] = (inArr[i] >>> 24) & 0xff;
        }
        let outLen = inLen * 4;
        if (padding) {
            const pad = out[outLen - 1];
            outLen -= pad;
            if (pad < 1 || pad > 8) return -1;
            if (outLen < 0) return -2;
            for (let i = outLen; i < inLen * 4; i++) {
                if (out[i] !== pad) return -3;
            }
        }
        return Uint8Array.from(out.slice(0, outLen));
    },

    jsonObjToUint8Array(obj) {
        const jsonString = JSON.stringify(obj).replace(/\//g, "\\/");
        return new TextEncoder().encode(jsonString);
    },

    uint8Array2JsonObj(uint8Array) {
        return JSON.parse(new TextDecoder("utf-8").decode(uint8Array));
    },

    generateRandomKey16() {
        const k = new Uint8Array(16);
        crypto.getRandomValues(k);
        return k;
    },

    generateRandomDelta() {
        const d = new Uint32Array(1);
        crypto.getRandomValues(d);
        return d[0] | 0x10000000;
    },

    deltaToBytes(d) {
        const b = new ArrayBuffer(4);
        new DataView(b).setUint32(0, d, true);
        return new Uint8Array(b);
    },

    bytesToDelta(b) {
        return new DataView(b.buffer, b.byteOffset, 4).getUint32(0, true);
    },

    /**
     * 修复版：时间戳转8字节数组（不使用setUint64）
     * @returns {Uint8Array} 8字节小端序时间戳数组
     */
    getTimestampBytes8() {
        const now = BigInt(Date.now()); // 当前时间戳（毫秒）
        const buffer = new ArrayBuffer(8);
        const dv = new DataView(buffer);
        
        // 拆分64位整数为低32位和高32位（小端序）
        const low = Number(now & 0xFFFFFFFFn);
        const high = Number((now >> 32n) & 0xFFFFFFFFn);
        
        // 先写低32位（小端序），再写高32位
        dv.setUint32(0, low, true);
        dv.setUint32(4, high, true);
        
        return new Uint8Array(buffer);
    },

    /**
     * 修复版：8字节数组转时间戳（不使用getUint64）
     * @param {Uint8Array} b8 - 8字节数组
     * @returns {number} 时间戳（毫秒）
     */
    bytesToTimestamp(b8) {
        if (b8.length !== 8) {
            throw new Error("时间戳字节数组必须为8字节");
        }
        const dv = new DataView(b8.buffer, b8.byteOffset, 8);
        
        // 读取低32位和高32位（小端序），合并为64位整数
        const low = dv.getUint32(0, true);
        const high = dv.getUint32(4, true);
        const timestamp = (BigInt(high) << 32n) | BigInt(low);
        
        return Number(timestamp);
    },
};

const TabTools = {
    // =========================
    // 解密：自动读 时间 + key + delta
    // =========================
    Tab2Json(buffer) {
        try {
            if (buffer.length < 28) throw new Error("file too short (need 28 bytes header)");

            // 头部解析
            const timestampBytes = buffer.subarray(0, 8);
            const key = buffer.subarray(8, 24);
            const deltaBytes = buffer.subarray(24, 28);
            const encrypted = buffer.subarray(28);

            const timestamp = byteTools.bytesToTimestamp(timestampBytes);
            const delta = byteTools.bytesToDelta(deltaBytes);

            const out = xxteaTools.decrypt(encrypted, key, delta, false, 0);
            const dataLen = out.length - 4;
            const m = new DataView(out.buffer, dataLen, 4).getUint32(0, true);

            if (m < 0 || m > dataLen) throw new Error("invalid length field");

            return {
                timestamp: timestamp,
                date: new Date(timestamp),
                jsonBytes: new Uint8Array(out.buffer, 0, m)
            };
        } catch (e) {
            throw new Error("decrypt failed: " + e.message);
        }
    },

    // =========================
    // 加密：自动写 时间 + key + delta 到头部
    // =========================
    Json2Tab(jsonBytes) {
        try {
            // 1. 生成头部
            const tsBytes = byteTools.getTimestampBytes8();
            const key = byteTools.generateRandomKey16();
            const delta = byteTools.generateRandomDelta();
            const deltaBytes = byteTools.deltaToBytes(delta);

            // 2. 数据补0 + 长度尾字段
            const len = jsonBytes.length;
            const pad = (4 - (len % 4)) % 4;
            const padBuf = new Uint8Array(pad).fill(0);

            const lenBuf = new ArrayBuffer(4);
            new DataView(lenBuf).setUint32(0, len, true);
            const lenBytes = new Uint8Array(lenBuf);

            const full = new Uint8Array([...jsonBytes, ...padBuf, ...lenBytes]);

            // 3. 加密
            const encrypted = xxteaTools.encrypt(full, key, delta, false, 0);

            // 4. 拼接最终文件：时间(8) + key(16) + delta(4) + 加密数据
            return new Uint8Array([...tsBytes, ...key, ...deltaBytes, ...encrypted]);
        } catch (e) {
            throw new Error("encrypt failed: " + e.message);
        }
    }
};


// 对外接口
// export { xxteaTools, byteTools, TabTools };

if (typeof window !== 'undefined') {
    window.TabEncrypt = { xxteaTools, byteTools, TabTools };
}
