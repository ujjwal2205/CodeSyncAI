import { redis } from "../redis";

export const setCode=async (roomId:string,code:string)=>{
    await redis.set(roomId,code);
}
export const getCode=async (roomId:string)=>{
    return await redis.get(roomId);
}
export const deleteCode=async(roomId:string)=>{
    await redis.del(roomId);
}