export default class Like {
    constructor(){
        this.like = [];
    }
    
    addLike (id , name, publisher , img){
        const like = {id,name ,publisher , img};
        this.like.push(like);
        this.persistData();
        return like;
    }
    
    deleteLike(id){
        const index = this.like.findIndex(el => el.id === id);
        this.like.splice(index , 1);
        
        this.persistData();
    }
    
    isLiked(id){
        return this.like.findIndex(el => el.id === id) !== -1;
    }
    
    numOfLike(){
        return this.like.length;
    }
    
    persistData(){
        localStorage.setItem('likes' , JSON.stringify(this.like));
    }
    
    readStorage(){
      const storage =  JSON.parse(localStorage.getItem('likes'));
        
        if (storage) this.like = storage;
    }
}