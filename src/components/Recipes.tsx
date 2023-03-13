import React, { useEffect, useState } from "react";
import PocketBase from "pocketbase";
import { Button, Collapse, Modal, Space, Table } from "antd";
import CreateRecipe from "./CreateRecipe";
const pb = new PocketBase("http://127.0.0.1:8090");
const { Column } = Table;
const { Panel } = Collapse;

function Recipes() {
  const [recipeData, setRecipeData] = useState([]);
  const [ingredients, setIngredients] = useState([]);
  const [categoryName, setCategoryName] = useState();
  const [editRecipe, setEditRecipe] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);

  const closeDeleteModal = () => {
    setDeleteModal(false);
  };
  const fetchData = async () => {
    pb.collection("recipes")
      .getFullList()
      .then((data) => {
        setRecipeData(data);

        const cat = data.map(async (cate) => {
          let ans = await pb.collection("categories").getOne(cate.category);
          setCategoryName(ans);
          console.log(ans);
        });
        const ing = data.map((ingr) => {
          ingr.ingredients.map(async (item) => {
            let ans = await pb.collection("ingredients").getOne(item);
            setIngredients((prevState) => [...prevState, ans]);
          });
        });
      });
  };

  function getNames(arr) {
    let ans = [];
    if (ingredients) {
      ingredients.map((item) => {
        arr.map((ing) => {
          ing === item.id ? ans.push(item.ingredient_name) : null;
        });
      });
      return ans;
    }
  }

  function getCategoryName(id) {
    let ans;
    if (categoryName) {
      id === categoryName.id ? (ans = categoryName.category_name) : null;
      return ans;
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <>
      {recipeData.map((item) => (
        <Collapse
          style={{ margin: "10px", fontFamily: "Helvetica, sans-serif" }}
          key={item.id}
        >
          <Panel header={item.recipe_name} showArrow={false}>
            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                marginBottom: "8px",
              }}
            >
              <Button
                style={{
                  marginRight: "8px",
                }}
                onClick={() => {
                  setEditRecipe({
                    visible: true,
                    recipe: item,
                  });
                }}
              >
                Edit
              </Button>
              <Button onClick={() => setDeleteModal(true)}>Delete</Button>
            </div>
            <div style={{ marginLeft: "16px" }}>
              <p style={{ fontWeight: "bold", marginBottom: "8px" }}>
                Category:{" "}
                <span style={{ fontWeight: "normal" }}>
                  {getCategoryName(item.category)}
                </span>
              </p>
              <p style={{ fontWeight: "bold", marginBottom: "8px" }}>
                Moist Meter:{" "}
                <span style={{ fontWeight: "normal" }}>{item.moist_meter}</span>
              </p>
              <p style={{ fontWeight: "bold", marginBottom: "8px" }}>
                Ingredients:{" "}
                <span style={{ fontWeight: "normal" }}>
                  {getNames(item.ingredients).join(", ")}
                </span>
              </p>
              <p style={{ fontWeight: "bold", marginTop: "8px" }}>
                How To:{" "}
                <span style={{ fontWeight: "normal" }}>{item.how_to}</span>
              </p>
            </div>
            <Modal
              title="Are you sure you want to delete this recipe?"
              open={deleteModal}
              onCancel={closeDeleteModal}
              style={{ maxWidth: "20%" }}
              footer={[
                <Button key="back" onClick={closeDeleteModal}>
                  Cancel
                </Button>,
                <Button
                  key="submit"
                  type="primary"
                  onClick={() => {
                    pb.collection("recipes").delete(item.id);
                  }}
                >
                  Delete
                </Button>,
              ]}
            />
          </Panel>
        </Collapse>
      ))}

      {editRecipe.visible && (
        <CreateRecipe
          pagetitle={"Update Recipe"}
          recipe={editRecipe.recipe}
          recipeId={editRecipe.recipe.id}
          defaultRecipeName={editRecipe.recipe.recipe_name}
          defaultCategory={getCategoryName(editRecipe.recipe.category)}
          defaultIngredients={editRecipe.recipe.ingredients}
          defaultMoisture={editRecipe.recipe.moist_meter}
          defaultHowTo={editRecipe.recipe.how_to}
          onCancel={() => setEditRecipe({ visible: false, recipe: null })}
          updateRecipe={true}
          updateButton={true}
        />
      )}
    </>
  );
}
export default Recipes;
