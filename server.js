const express = require("express");
const fs = require("fs");
const crypto = require("crypto");

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static("public"));

const USERS_FILE = "users.json";
const LOG_FILE = "logs.txt";


// DOSYA YOKSA OLUŞTUR
if (!fs.existsSync(USERS_FILE)) {
    fs.writeFileSync(USERS_FILE, JSON.stringify([]));
}


// SHA-256 HASH
function hashPassword(password) {
    return crypto
        .createHash("sha256")
        .update(password)
        .digest("hex");
}


// LOG YAZMA
function writeLog(message) {

    const time = new Date().toLocaleString();

    fs.appendFileSync(
        LOG_FILE,
        `[${time}] ${message}\n`
    );
}


// GÜÇLÜ ŞİFRE KONTROLÜ
function isStrongPassword(password) {

    const regex =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;

    return regex.test(password);
}



// ================= REGISTER =================

app.post("/register", (req, res) => {

    const { username, password } = req.body;


    // BOŞ ALAN KONTROLÜ
    if (!username || !password) {

        return res.json({
            success: false,
            message: "Kullanıcı adı ve şifre boş olamaz!"
        });
    }


    let users = JSON.parse(
        fs.readFileSync(USERS_FILE)
    );


    // AYNI KULLANICI KONTROLÜ
    const existingUser =
        users.find(u => u.username === username);

    if (existingUser) {

        return res.json({
            success: false,
            message: "Bu kullanıcı adı zaten kayıtlı!"
        });
    }


    // GÜÇLÜ ŞİFRE KONTROLÜ
    if (!isStrongPassword(password)) {

        return res.json({
            success: false,
            message:
                "Şifre en az 8 karakter, büyük harf, küçük harf, sayı ve özel karakter içermelidir!"
        });
    }


    // ŞİFRE HASHLEME
    const hashedPassword =
        hashPassword(password);


    // YENİ KULLANICI EKLE
    users.push({

        username,

        password: hashedPassword,

        attempts: 0,

        locked: false
    });


    // DOSYAYA YAZ
    fs.writeFileSync(
        USERS_FILE,
        JSON.stringify(users, null, 2)
    );


    // LOG
    writeLog(`${username} registered`);


    // RESPONSE
    res.json({

        success: true,

        message: "Kayıt Başarılı!"
    });
});




// ================= LOGIN =================

app.post("/login", (req, res) => {

    const { username, password } = req.body;


    // BOŞ ALAN KONTROLÜ
    if (!username || !password) {

        return res.json({
            success: false,
            message: "Kullanıcı adı ve şifre boş olamaz!"
        });
    }


    let users = JSON.parse(
        fs.readFileSync(USERS_FILE)
    );


    // KULLANICI BUL
    const user =
        users.find(u => u.username === username);


    // KULLANICI YOK
    if (!user) {

        writeLog("Unknown user login attempt");

        return res.json({

            success: false,

            message: "Kullanıcı bulunamadı!"
        });
    }


    // HESAP KİLİTLİ
    if (user.locked) {

        writeLog(`${username} tried locked account`);

        return res.json({

            success: false,

            message: "Hesap kilitlendi!"
        });
    }


    // HASHLENMİŞ ŞİFRE
    const hashedPassword =
        hashPassword(password);


    // ŞİFRE DOĞRU
    if (hashedPassword === user.password) {

        user.attempts = 0;

        fs.writeFileSync(
            USERS_FILE,
            JSON.stringify(users, null, 2)
        );

        writeLog(`${username} successful login`);

        return res.json({

            success: true,

            message: "Giriş Başarılı!"
        });
    }


    // ŞİFRE YANLIŞ
    else {

        user.attempts += 1;


        // 3 HATALI GİRİŞ
        if (user.attempts >= 3) {

            user.locked = true;

            writeLog(`${username} account locked`);
        }


        fs.writeFileSync(
            USERS_FILE,
            JSON.stringify(users, null, 2)
        );


        writeLog(`${username} failed login`);


        return res.json({

            success: false,

            message:
                `Hatalı Şifre! (${user.attempts}/3)`
        });
    }
});




// SERVER
app.listen(PORT, () => {

    console.log(
        `Server running on http://localhost:${PORT}`
    );
});