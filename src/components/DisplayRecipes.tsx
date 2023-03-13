import { useState, useEffect } from "react";
import { supabase } from "../client";
import { Button, Collapse, Modal, Tag } from "antd";
import "../App.css";
import RecipeForm from "./RecipeForm";

const { Panel } = Collapse;

const DisplayRecipes = () => {
  const [allRecipeData, setAllRecipeData] = useState([]);
  const [allQuantityData, setAllQuantityData] = useState([]);
  const [allCategoryData, setAllCategoryData] = useState([]);
  const [allIngredientNames, setAllIngredientNames] = useState([]);

  const [currentRecipeId, setCurrentRecipeId] = useState();
  const [currentRecipeName, setCurrentRecipeName] = useState();
  const [currentCategoryName, setCurrentCategoryName] = useState();
  const [currentHowTo, setCurrentHowTo] = useState();
  const [
    particularRecipeIngredientsAndQuantities,
    setParticularRecipeIngredientsAndQuantities,
  ] = useState();
  const [currentIngredientsAndQuantities, setCurrentIngredientsAndQuantities] =
    useState([]);
  const [updateRecipe, setUpdateRecipe] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);

  const [ingredients, setIngredients] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const quantities = await supabase.from("quantities").select("*");
        setAllQuantityData(quantities.data);

        const recipes = await supabase.from("recipes").select("*");
        setAllRecipeData(recipes.data);

        const categoryData = await supabase.from("categories").select("*");
        setAllCategoryData(categoryData.data);

        const ingredients = await supabase
          .from("ingredients")
          .select("id, ingredient_name");
        setAllIngredientNames(ingredients.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, []);

  const getCategoryName = (categoryId) => {
    const category = allCategoryData.find((item) => item.id === categoryId);
    return category ? (
      <Tag key={category.id} color="blue">
        {category.category_name}
      </Tag>
    ) : (
      ""
    );
  };

  const closeDeleteModal = () => {
    setDeleteModal(false);
  };

  const getCategoryNameOnly = (categoryId) => {
    const category = allCategoryData.find((item) => item.id === categoryId);
    return category.category_name;
  };

  const getIngredientName = (ingredientId) => {
    const ingredient = allIngredientNames.find(
      (item) => item.id === ingredientId
    );
    return ingredient ? (
      <Tag key={ingredient.id} color="blue">
        {ingredient.ingredient_name}
      </Tag>
    ) : (
      ""
    );
  };

  const getIngredientNameOnly = (ingredientId) => {
    const ingredient = allIngredientNames.find(
      (item) => item.id === ingredientId
    );
    return ingredient ? ingredient.ingredient_name : null;
  };

  const handleDeleteRecipe = async (recipe) => {
    try {
      const { data, error } = await supabase
        .from("quantities")
        .delete()
        .eq("recipe_id", recipe.id)
        .then(async () => {
          await supabase.from("recipes").delete().eq("id", recipe.id);
        });

      if (error) throw error;
      console.log("Deleted row:", data);
    } catch (error) {
      console.error("Error deleting row:", error.message);
    }
  };

  return (
    <>
      {allRecipeData.map((recipe) => (
        <Collapse key={recipe.id}>
          <Panel key={recipe.id} header={recipe.recipe_name} showArrow={false}>
            <div>
              <Button
                onClick={() => {
                  console.log(allQuantityData);
                  setUpdateRecipe(true);
                  setCurrentRecipeId(recipe.id);
                  setCurrentRecipeName(recipe.recipe_name);
                  setCurrentCategoryName(getCategoryNameOnly(recipe.category));
                  setCurrentHowTo(recipe.how_to);
                  setCurrentIngredientsAndQuantities(
                    allQuantityData.map((item) => {
                      if (item.recipe_id === recipe.id) {
                        return {
                          name: item.ingredient_id,
                          quantity: item.quantity,
                        };
                      }
                    })
                  );
                }}
              >
                Edit
              </Button>
              <Button
                onClick={() => {
                  setDeleteModal(true);
                }}
              >
                Delete
              </Button>
            </div>
            <div>
              <p>
                Category
                <br />
                {getCategoryName(recipe.category)}
              </p>
              <p>
                Ingredients
                <br />
                {allQuantityData.map((quantity) => {
                  if (recipe.id === quantity.recipe_id) {
                    return (
                      <>
                        {" "}
                        <span key={quantity.id}>
                          {getIngredientNameOnly(quantity.ingredient_id)}
                          {
                            <Tag key={quantity.id} color="blue">
                              {quantity.quantity}
                            </Tag>
                          }
                        </span>
                        <br />
                      </>
                    );
                  }
                  return null;
                })}
              </p>
              <p>
                How To
                <br />
                <Tag key={recipe.id} color="blue">
                  {recipe.how_to}
                </Tag>
              </p>
            </div>
            <Modal open={updateRecipe} title={"Update Recipe"}>
              <RecipeForm
                handleUpdate={true}
                currentRecipeId={currentRecipeId}
                currentRecipeName={currentRecipeName}
                currentHowTo={currentHowTo}
                currentCategoryName={currentCategoryName}
                currentIngredientsAndQuantities={
                  currentIngredientsAndQuantities
                }
                setCurrentIngredientsAndQuantities={
                  setCurrentIngredientsAndQuantities
                }
                ingredients={ingredients}
                setIngredients={setIngredients}
                allQuantityData={allQuantityData}
                getIngredientNameOnly={getIngredientNameOnly}
              />
            </Modal>
            <Modal
              title="Are you sure you want to delete this recipe?"
              open={deleteModal}
              onCancel={closeDeleteModal}
              footer={[
                <Button
                  key="back"
                  onClick={() => {
                    handleDeleteRecipe(recipe);
                  }}
                >
                  Cancel
                </Button>,
                <Button
                  key="submit"
                  type="primary"
                  onClick={() => {
                    handleDeleteRecipe(recipe);
                  }}
                >
                  Delete
                </Button>,
              ]}
            />
          </Panel>
        </Collapse>
      ))}
    </>
  );
};

export default DisplayRecipes;
