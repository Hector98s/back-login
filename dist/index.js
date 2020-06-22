"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// Express import
var express_1 = __importDefault(require("express"));
//json web token import
var jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
var bcryptjs_1 = __importDefault(require("bcryptjs"));
//cors import
var cors_1 = __importDefault(require("cors"));
// token enviroment
var token_middleware_1 = __importDefault(require("./middlewares/token.middleware"));
//mongo db helper
var mongo_db_helper_1 = __importDefault(require("./helpers/mongo.db.helper"));
//envimorent
var env_production_1 = __importDefault(require("./enviroments/env.production"));
console.log(env_production_1.default);
//declaraciones de constantes 
var app = express_1.default();
var token = token_middleware_1.default();
var mongoDB = mongo_db_helper_1.default.getInstance(env_production_1.default.MONGODB);
//mediawares
app.use(express_1.default.urlencoded({ extended: true }));
app.use(express_1.default.json());
//mediaware for cors
app.use(cors_1.default({ origin: true, credentials: true }));
app.get('/api/auth/testing', function (req, res) {
    res.status(200).json({
        ok: true,
        msg: 'API CORRECTA'
    });
});
app.post('/api/auth/login', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, userName, password, mockUser;
    return __generator(this, function (_b) {
        _a = req.body, userName = _a.userName, password = _a.password;
        mockUser = {
            id: 1,
            userName: 'ivan',
            password: '123',
            roles: ['admin', 'super']
        };
        if (userName == 'ivan' && password == '123') {
            jsonwebtoken_1.default.sign(mockUser, 'secretkeyword', { expiresIn: '120s' }, function (err, token) {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        msg: "ssss",
                        err: err
                    });
                }
                res.status(200).json({
                    ok: true,
                    msg: 'el usuario es correcto',
                    payload: {
                        userName: mockUser.userName,
                        roles: mockUser.roles
                    },
                    token: token
                });
            });
        }
        else {
            res.status(403).json({
                ok: true,
                msj: 'el usuario es incorrecto'
            });
        }
        return [2 /*return*/];
    });
}); });
app.get('/test', function (req, res) {
    res.status(200).json({ okay: true });
});
app.post('/api/auth/createUser', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, email, password, fullName, urlPhoto, rol, newUser, insert, error_1;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = req.body, email = _a.email, password = _a.password, fullName = _a.fullName, urlPhoto = _a.urlPhoto, rol = _a.rol;
                _b.label = 1;
            case 1:
                _b.trys.push([1, 3, , 4]);
                newUser = {
                    email: email,
                    password: bcryptjs_1.default.hashSync(password, 10),
                    fullName: fullName,
                    urlPhoto: urlPhoto,
                    rol: rol,
                };
                return [4 /*yield*/, mongoDB.db.collection("users").insertOne(newUser)];
            case 2:
                insert = _b.sent();
                res
                    .status(200)
                    .json({ ok: true, msg: "User created", user: insert.insertedId });
                return [3 /*break*/, 4];
            case 3:
                error_1 = _b.sent();
                console.log(error_1);
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
app.get('/api/auth/getCustumers', token.verify, function (req, res) {
    var authUser = req.body.authUser;
    var mockCustumer = [
        {
            clave: 'ALFKI',
            nomrbe: 'American'
        },
        {
            clave: 'GKN',
            nomrbe: 'Grupo Pirelli'
        },
        {
            clave: 'GM',
            nomrbe: 'grupo mostr'
        }
    ];
    res.status(200).json({
        ok: true,
        msg: 'Permiso de acceso concedido',
        data: mockCustumer,
        user: authUser
    });
});
app.listen(env_production_1.default.API.PORT, function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                console.log("Servidor de api funcionando correctamente en el puerto " + env_production_1.default.API.PORT);
                //connect to MongoDB
                console.log(env_production_1.default.API.PORT);
                return [4 /*yield*/, mongoDB.connect()];
            case 1:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); });
//handle errors
process.on('unhadedledReflection', function (err) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        //close mongoDB Connection
        mongoDB.close();
        process.exit();
        return [2 /*return*/];
    });
}); });
