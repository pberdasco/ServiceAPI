import {hash, compare} from 'bcrypt';

export default class Cripto{
    static async encrypt(pass){
        const passwordHash = await hash(pass, 8);
        return passwordHash;
    }
    
    verified(){
    
    }
} 
