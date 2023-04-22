import config from "../config.js";

export function showError(req, res, error){
    if (config.LOGERRORS === "1"){
        console.log(error);
    }
    res.status(error?.status || 500).send({message: error?.message || error}); 
}
