import { useEffect, useState } from "react";
import "../App.css";
import PocketBase from "pocketbase";
import Form from "./Form";
import { supabase } from "../client";

const pb = new PocketBase("http://127.0.0.1:8090");
pb.autoCancellation(false);

const CreateRecipe = (props) => {
  const [recipeIngredients, setRecipeIngredients] = useState([]);
  const [recipeIngredientsIds, setRecipeIngredientsIds] = useState([]);
  const [ingredient, setIngredient] = useState<string | null>(null);

  const [recipeName, setRecipeName] = useState<string | null>(null);

  const [howTo, setHowTo] = useState<string | null>(null);

  const [recipeCategory, setRecipeCategory] = useState<string | null>(null);
  const [recipeCategoryIds, setRecipeCategoryIds] = useState([]);

  const [recipeMoisture, setRecipeMoisture] = useState<string | null>(null);

  const [options, setOptions] = useState<string[]>([]);
  const [categoryOptions, setCategoryOptions] = useState<string[]>([]);
  const [ingredientQuantity, setIngredientQuantity] = useState([]);
  const [newIngredientName, setNewIngredientName] = useState<string | null>(
    null
  );

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isIngredientOpen, setIngredientOpen] = useState(false);

  const [submitDisabled, setSubmitDisabled] = useState(true);

  const showIngredientModal = (e) => {
    setIngredient(e);
    setIsModalOpen(true);
  };

  const showIngredientQuantityModal = (e) => {
    setIngredientOpen(true);
  };

  const handleIngredientSelect = (item) => {
    recipeIngredients.push(item);
    console.log(recipeIngredients);
  };

  const handleIngredientDeselect = (item) => {
    const newIngredients = recipeIngredients.filter((ingr) => ingr !== item);
    setRecipeIngredients(newIngredients);
  };

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setIngredientOpen(false);
  };

  const handleAddNewIngredient = async () => {
    setIsModalOpen(false);
    let newIngredient = {
      ingredient_name: newIngredientName,
    };
    const record = await pb.collection("ingredients").create(newIngredient);
  };

  const handleUpdateRecipe = () => {
    pb.collection("recipes")
      .update(props.recipeId, recipeUpdatePayload)
      .then((res) => console.log(res));
  };

  const handleCreateRecipe = () => {
    pb.collection("recipes")
      .create(recipePayload)
      .then((res) => {
        console.log(res);
      });
    console.log(recipePayload);
  };

  const ingredientIds = recipeIngredients.map((ingredient) => {
    const index = options.indexOf(ingredient);
    return recipeIngredientsIds[index];
  });

  function findCategoryId(categoryName: string): number | null {
    const index = categoryOptions.indexOf(categoryName);
    if (index === -1) {
      return null;
    }
    return recipeCategoryIds[index];
  }

  const recipePayload = {
    recipe_name: recipeName,
    how_to: howTo,
    category: findCategoryId(recipeCategory),
    ingredients: ingredientIds,
    moist_meter: recipeMoisture,
  };

  const recipeUpdatePayload = {
    recipe_name: recipeName === null ? props.defaultRecipeName : recipeName,
    how_to: howTo === null ? props.default_how_to : howTo,
    category:
      findCategoryId(recipeCategory) === null
        ? props.defaultCategory
        : recipeCategory,
    ingredients:
      ingredientIds.length === 0 ? props.defaultIngredients : ingredientIds,
    moist_meter:
      recipeMoisture === null ? props.defaultMoisture : recipeMoisture,
  };

  useEffect(() => {
    pb.collection("ingredients")
      .getFullList()
      .then((data) => {
        const newOptions = data.map((item) => item.ingredient_name);
        const ids = data.map((item) => item.id);
        setOptions(newOptions);
        setRecipeIngredientsIds(ids);
      });
    pb.collection("categories")
      .getFullList()
      .then((data) => {
        const newOptions = data.map((item) => item.category_name);
        const ids = data.map((item) => item.id);
        setCategoryOptions(newOptions);
        setRecipeCategoryIds(ids);
      });

    if (
      recipeName != null &&
      recipeCategory != null &&
      recipeMoisture != null &&
      howTo != null &&
      recipeIngredients.length > 0
    ) {
      setSubmitDisabled(false);
    }
  }, [recipeName, recipeCategory, recipeMoisture, howTo, recipeIngredients]);

  useEffect(() => {
    if (
      recipeName === "" ||
      recipeCategory === null ||
      recipeMoisture === null ||
      howTo === "" ||
      recipeIngredients.length === 0
    ) {
      setSubmitDisabled(true);
    }
  }, [recipeName, recipeCategory, recipeMoisture, howTo, recipeIngredients]);

  return (
    <Form
      pagetitle={props.pagetitle ? props.pagetitle : "Create Recipe"}
      recipe_name={setRecipeName}
      category_options={categoryOptions}
      category_setter={setRecipeCategory}
      ingredient_select_modal={showIngredientQuantityModal}
      ingredient_options={options}
      select_ingredient={handleIngredientSelect}
      deselect_ingredient={handleIngredientDeselect}
      add_ingredient_modal={showIngredientModal}
      moisture_setter={setRecipeMoisture}
      how_to_setter={setHowTo}
      new_ingredient_modal={isModalOpen}
      cancel_new_ingredient_modal={handleCancel}
      submit_new_ingredient={handleAddNewIngredient}
      new_ingredient_name_setter={setNewIngredientName}
      submit_recipe_data={
        props.updateRecipe ? handleUpdateRecipe : handleCreateRecipe
      }
      update_record_id={props.recipeId}
      default_recipe_name={props.defaultRecipeName}
      default_category={props.defaultCategory}
      default_ingredients={props.defaultIngredients}
      default_moisture={props.defaultMoisture}
      default_how_to={props.defaultHowTo}
      update_button={props.updateButton}
      submitValidation={submitDisabled}
    />
  );
};

export default CreateRecipe;
