import { useEffect, useState } from "react";
import CreateRecipe from "./components/CreateRecipe";
import DisplayRecipes from "./components/DisplayRecipes";
import RecipeForm from "./components/RecipeForm";
import Recipes from "./components/Recipes";

function App() {
  return (
    <>
      <DisplayRecipes />
      <RecipeForm />
      {/* <CreateRecipe /> <Recipes /> */}
    </>
  );
}

export default App;
