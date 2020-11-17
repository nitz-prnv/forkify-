import Search from './models/Search';
import Recipe from './models/Recipe';
import List from './models/List';
import Like from './models/Like';
import * as searchView from './views/searchView';
import * as recipeView from './views/recipeView';
import * as listView from './views/listView';
import * as likeView from './views/likeView';
import {elements , renderLoader , clearLoader} from './views/Base';

/**
Global state of the app
* - search object
* - current recipe object 
* - Shopping list object 
* - liked recipe
*/
alert("fork");
const state = {};


/* SEARCH CONTROLLER  */
const controlSearch = async () =>{
    
    const qurey = searchView.getInput() ;
    
    if(qurey){
        state.search = new Search(qurey);
        
        searchView.clearInput();
        searchView.clearResults();
        renderLoader(elements.searchRes);
        
        
        try{
            await state.search.getResults();
        
            clearLoader();
            searchView.renderResults(state.search.result);
        }catch(error){
            console.log('error');
            clearLoader();
        }
    }
}

 elements.searchForm.addEventListener('submit', e =>{
    e.preventDefault();
    controlSearch();
});


elements.searchResPage.addEventListener('click' , e =>{
     const btn = e.target.closest('.btn-inline');
        
    if(btn){
        const goToPage = parseInt(btn.dataset.goto , 10);
        searchView.clearResults();
        searchView.renderResults(state.search.result , goToPage);
    }
    
})


/* RECIPE CONTROLLER  */
const controlRecipe = async () =>{
    const id = window.location.hash.replace('#' , '');
    
    if(id){
        // Perpare the UI for changes
        recipeView.clearRecipe();
        renderLoader(elements.recipe);
        if(state.search) searchView.highlightSelected(id);
        
        // Create new Recipe object
        state.recipe = new Recipe(id);
        
        try{
            // Get Recipe and pares it
            await state.recipe.getRecipe();
            state.recipe.parseIngredients();
            
            // Calc Servings and Time
            state.recipe.calcServings();
            state.recipe.calcTime();
            // Render the recipe
            clearLoader();
            recipeView.renderRecipe(state.recipe , state.like.isLiked(id));
        }
        catch(err){
            alert(err);
            console.log('error on getting recipe');
        }
        
    }
};

window.addEventListener('hashchange' , controlRecipe);
window.addEventListener('load' , controlRecipe);


// 2nd way ['hashchange' , 'load'].forEach(event => window.addEventListener(event , controlRecipe));


/* LIST CONTROLLER  */
const controlList = () =>{
    // create a new list if there is no list there
    
    if(!state.list) state.list = new List();
    
    // Add each Ingredients to the list 
    console.log(state.recipe.ingredients);
    state.recipe.ingredients.forEach( el => {
      const item = state.list.addItem(el.count , el.unit , el.ingredient); 
        listView.renderList(item);
    });
};



/* LIKE CONTROLLER  */
const controlLike = () => {
    
    if(!state.like) state.like = new Like();
    
    const currentId = state.recipe.id;
    
    if(!state.like.isLiked(currentId)){
        // add recipe to like array
        const newLike = state.like.addLike( currentId , state.recipe.title, state.recipe.publisher , state.recipe.img)
        
        // toggle like btn
        likeView.toggleLikeBtn(true);
        //print to  the UI
        likeView.renderLike(newLike);
    }else{
        // remove the recipe from the array
        state.like.deleteLike(currentId);
        
        // toggle like btn
        likeView.toggleLikeBtn(false);
        
        //print to UI
        likeView.deleteLike(currentId);
    }
    
    likeView.toggleLikeMenu(state.like.numOfLike());
};


/* EVENT LISTENERs */

/* RESTORING THE LIKES FROM LOCALSTORAGE */
window.addEventListener('load' , ()=>{
    
    state.like = new Like();
    
    state.like.readStorage();
    
    likeView.toggleLikeMenu(state.like.numOfLike());
   
    state.like.like.forEach(like => likeView.renderLike(like));
});


/* FOR SHOPPING LIST SIDE */
elements.shopping.addEventListener('click' , e => {
   
    const id = e.target.closest('.shopping__item').dataset.itemid ;
    
    if(e.target.matches('.shopping__delete , .shopping__delete *'))
    {
        state.list.deleteItem(id);
        listView.deleteItem(id);
    }
    else if(e.target.matches('.shopping__count-value'))
    {
        const val = parseFloat(e.target.value , 10);
        state.list.updateCount(id , val);
    }
    
});


/* FOR RECIPE SIDE */
elements.recipe.addEventListener( 'click',e => {
    
    if(e.target.matches('.btn-dec , .btn-dec *')){
        if(state.recipe.servings > 1){
            state.recipe.updateServings('dec');
            recipeView.upgradeServingsIng(state.recipe);
        }
        
    }else if(e.target.matches('.btn-inc , .btn-inc *')){
        state.recipe.updateServings('inc');
        recipeView.upgradeServingsIng(state.recipe);
    }else if(e.target.matches('.recipe__btn--add , .recipe__btn--add *')){
        controlList();
    }else if(e.target.matches('.recipe__love , .recipe__love *')){
          controlLike();   
    }
    
});


