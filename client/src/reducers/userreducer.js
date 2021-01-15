export const initialstate=null

export const reducer=(state,action)=>{

        if(action.type==="USER"){
                return {
                    ...state,
                    username:action.payload.username,
                    _id:action.payload._id
                }
        }
               
        if(action.type==="CLEAR"){
            return null
    }
        return state

}