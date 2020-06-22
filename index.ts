// Express import
import express, { response, json } from 'express';
import { Request, Response }from 'express';


//json web token import
import jwt from 'jsonwebtoken'

import bcrypt from 'bcryptjs';

//cors import
import cors from 'cors'; 

// token enviroment
import AuthToken from './middlewares/token.middleware';
//mongo db helper
import MongoDBHelper from './helpers/mongo.db.helper';

//envimorent
import ENV from './enviroments/env.production';
console.log(ENV);

//declaraciones de constantes 
const app = express();
const token = AuthToken();
const mongoDB = MongoDBHelper.getInstance(ENV.MONGODB);

//mediawares
app.use(express.urlencoded({extended: true}));
app.use(express.json());

//mediaware for cors
app.use(cors({origin:true, credentials: true}));

app.get('/api/auth/testing', (req:Request, res:Response) => { 
    res.status(200).json({
        ok: true,
        msg: 'API CORRECTA'
    });
});

app.post('/api/auth/login', async (req:Request,res:Response) =>{
    const { userName, password } = req.body;

    const user = await mongoDB.db.collection('users').findOne({email: userName})
     //existe el usuario
    if(user){
        if(!bcrypt.compareSync(password, user.password)){
            return res.status(403).json({
                ok: false,
                msg: 'lo sentimos no es valido'
            });
        }

        const userValid={
            uid: user._id,
            email: user.email,
            fullName: user.fullName,
            urlPhoto: user.urlPhoto,
            rol: user.rol
        }

        jwt.sign(userValid, 'secretkeyword',{ expiresIn: '120s'}, (err:any, token)=>{

            if (err){
                return res.status(500).json({
                    ok: false,
                    msg: 'ocurrio un error',
                    err
                });
            }

            res.status(200).json({
                ok: true,
                msg: 'el usuario se autentico correcto',
                token
      
               });
        });
    }
    else{
        res.status(404).json({
            ok:true,
            msg:'no existe',
            token
        });
    }
        
      
     
     
});


app.get('/test', (req,res) => {
    res.status(200).json({okay:true});
});

app.post('/api/auth/createUser',async (req:Request, res:Response)=>{
    
    const { email, password, fullName, urlPhoto, rol } = req.body;

    try {
      const newUser = {
        email,
        password: bcrypt.hashSync(password, 10),
        fullName,
        urlPhoto,
        rol,
      };
      const insert = await mongoDB.db.collection("users").insertOne(newUser);
  
      res
        .status(200)
        .json({ ok: true, msg: "User created", user: insert.insertedId });
    } catch (error) {
      console.log(error);
    }

});
app.get('/api/auth/getCustumers', token.verify,(req: Request, res: Response)=>{
    const { authUser } = req.body;

    const mockCustumer = [
        {
        clave: 'ALFKI',
        nomrbe:'American'
         },
         {
            clave: 'GKN',
            nomrbe:'Grupo Pirelli'
         },
         {
            clave: 'GM',
            nomrbe:'grupo mostr'
        }

];

    res.status(200).json({
        ok:true,
        msg:'Permiso de acceso concedido',
        data: mockCustumer,
        user: authUser
    });
});

app.listen(ENV.API.PORT, async()=> {
  
    console.log(`Servidor de api funcionando correctamente en el puerto ${ENV.API.PORT}`);
    //connect to MongoDB
    console.log(ENV.API.PORT);
    await mongoDB.connect();

});
//handle errors
process.on('unhadedledReflection', async (err:any)=>{
    //close mongoDB Connection
    mongoDB.close();
    process.exit();
     });