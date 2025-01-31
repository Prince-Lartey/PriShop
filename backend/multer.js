import multer from "multer";

const storage = multer.diskStorage({
    destination: function (req, res, cb) {
        cb(null, "uploads/")
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9)
        const filename = file.originalname.split(".")[0]
        cb(null, filename + "-" + uniqueSuffix + ".png")
    }
})

const upload = multer({storage: storage, limits: { fileSize: 50 * 1024 * 1024 }})

export default upload