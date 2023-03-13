import { useState, useEffect } from "react";
import { Form, Input, Button, InputNumber, Select, Segmented } from "antd";
import { supabase } from "../client";
import "../App.css";
import DefaultForm from "./DefaultForm";
import { v4 as uuidv4 } from "uuid";

const RecipeForm = (props) => {
  const [allRecipes, setAllRecipes] = useState([]);
  const [allCategories, setAllCategories] = useState([]);
  const [allIngredients, setAllIngredients] = useState([]);

  const [allRecipeIds, setAllRecipeIds] = useState([]);
  const [allCategoryIds, setAllCategoryIds] = useState([]);
  const [allIngredientIds, setAllIngredientIds] = useState([]);

  const [allIngredientNames, setAllIngredientNames] = useState([]);
  const [allOnlyIngredientNames, setAllOnlyIngredientNames] = useState([]);
  const [allCategoryNames, setAllCategoryNames] = useState([]);

  const [currentRecipeName, setCurrentRecipeName] = useState();
  const [currentCategoryName, setCurrentCategoryName] = useState();
  const [currentHowTo, setCurrentHowTo] = useState();
  const [currentIngredientsAndQuantities, setCurrentIngredientsAndQuantities] =
    useState([]);

  const [form] = Form.useForm();
  const [recipeUUID, setRecipeUUID] = useState();
  const [ingredients, setIngredients] = useState([]);

  async function fetchData() {
    const fetchedRecipesData = await supabase.from("recipes").select();
    setAllRecipes(fetchedRecipesData.data);

    const recipeIds = fetchedRecipesData.data.map((recipe) => recipe.id);
    setAllRecipeIds(recipeIds);

    const fetchedIngredientsData = await supabase.from("ingredients").select();
    setAllIngredients(fetchedIngredientsData.data);

    const ingredientNames = fetchedIngredientsData.data.map((ingredient) => ({
      label: ingredient.ingredient_name,
      value: ingredient.ingredient_name,
    }));
    setAllIngredientNames(ingredientNames);

    const ingredientOnlyNames = fetchedIngredientsData.data.map(
      (ingredient) => ingredient.ingredient_name
    );
    setAllOnlyIngredientNames(ingredientOnlyNames);

    const ingredientIds = fetchedIngredientsData.data.map(
      (ingredient) => ingredient.id
    );
    setAllIngredientIds(ingredientIds);

    const fetchedCategoriesData = await supabase.from("categories").select();
    setAllCategories(fetchedCategoriesData.data);

    const categoryNames = fetchedCategoriesData.data.map(
      (category) => category.category_name
    );
    setAllCategoryNames(categoryNames);

    const categoryIds = fetchedCategoriesData.data.map(
      (category) => category.id
    );
    setAllCategoryIds(categoryIds);
  }

  const addIngredient = () => {
    props.default_ingredients
      ? props.setCurrentIngredientsAndQuantities([
          ...props.currentIngredientsAndQuantities,
          { name: "", quantity: 1 },
        ])
      : setIngredients([...ingredients, { name: "", quantity: 1 }]);
  };

  const removeIngredient = (index) => {
    const newIngredients = [
      props.default_ingredients
        ? { ...props.currentIngredientsAndQuantities }
        : { ...ingredients },
    ];
    newIngredients.splice(index, 1);
    props.setIngredients
      ? props.setCurrentIngredientsAndQuantities(newIngredients)
      : setIngredients(newIngredients);
  };

  const handleIngredientChange = (index, field, value) => {
    const newIngredients = [
      ...(props.currentIngredientsAndQuantities
        ? props.currentIngredientsAndQuantities
        : ingredients),
    ];

    if (field === "name") {
      newIngredients[index].name = value;
    } else if (field === "quantity") {
      newIngredients[index].quantity = value;
    }
    console.log(newIngredients);
    props.setCurrentIngredientsAndQuantities
      ? props.setCurrentIngredientsAndQuantities(newIngredients)
      : setCurrentIngredientsAndQuantities(newIngredients);
  };

  const handleSelectRecipeCategory = (c) => {
    setCurrentCategoryName(c);
  };

  const handleSubmit = async () => {
    const uniqueId = uuidv4();
    setRecipeUUID(uniqueId);
    const { data, error } = await supabase
      .from("recipes")
      .insert([createRecipePayload])
      .then(() => handleAddQuantities());
  };

  const handleUpdate = async () => {
    const updatedRecipe = {
      recipe_name: currentRecipeName
        ? currentRecipeName
        : props.currentRecipeName,
      how_to: currentHowTo ? currentHowTo : props.currentHowTo,
      category: findCategoryId(
        currentCategoryName ? currentCategoryName : props.currentCategoryName
      ),
    };

    const { data, error } = await supabase
      .from("recipes")
      .update(updatedRecipe)
      .match({ id: props.currentRecipeId });

    if (error) {
      console.error(error);
      return;
    }

    await handleDeleteQuantities();

    await handleAddQuantities();
  };

  const handleDeleteQuantities = async () => {
    await supabase
      .from("quantities")
      .delete()
      .match({ recipe_id: props.currentRecipeId });
  };

  const handleAddQuantities = async () => {
    for (const item of props.currentIngredientsAndQuantities
      ? props.currentIngredientsAndQuantities
      : currentIngredientsAndQuantities) {
      console.log(currentIngredientsAndQuantities);
      const newQuantity = {
        recipe_id: props.currentRecipeId,
        ingredient_id: findIngredientId(item.name),
        quantity: item.quantity,
      };
      await supabase.from("quantities").insert([newQuantity]);
      // setCurrentIngredientsAndQuantities([]);
    }
  };

  function findCategoryId(categoryName) {
    const index = allCategoryNames.indexOf(categoryName);
    if (index === -1) {
      return null;
    }
    return allCategoryIds[index];
  }

  function findIngredientId(ingredientName) {
    const index = allOnlyIngredientNames.indexOf(ingredientName);
    if (index === -1) {
      return null;
    }
    return allIngredientIds[index];
  }

  const createRecipePayload = {
    id: recipeUUID,
    recipe_name: currentRecipeName,
    how_to: currentHowTo,
    category: findCategoryId(currentCategoryName),
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <DefaultForm
      handle_submit={props.handleUpdate === true ? handleUpdate : handleSubmit}
      recipe_name_setter={setCurrentRecipeName}
      ingredients={ingredients}
      handle_ingredient_change={handleIngredientChange}
      all_ingredient_names={allIngredientNames}
      remove_ingredient={removeIngredient}
      add_ingredient={addIngredient}
      category_options={allCategoryNames}
      category_setter={handleSelectRecipeCategory}
      how_to_setter={setCurrentHowTo}
      //
      default_recipe_id={props.currentRecipeId}
      default_recipe_name={props.currentRecipeName}
      default_how_to={props.currentHowTo}
      default_ingredients={props.currentIngredientsAndQuantities}
      default_category={props.currentCategoryName}
      allQuantityData={props.allQuantityData}
      getIngredientNameOnly={props.getIngredientNameOnly}
      // default_ingredients={props.ingredients}
    />
  );
};

export default RecipeForm;
