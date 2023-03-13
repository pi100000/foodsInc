import { Form, Input, Button, InputNumber, Select, Segmented } from "antd";
import { MinusCircleOutlined } from "@ant-design/icons";
import "../App.css";
const { TextArea } = Input;

const DefaultForm = (props) => {
  const selectedIngredientNames = props.allQuantityData
    ? props.allQuantityData.map((item) =>
        props.getIngredientNameOnly(item.ingredient_id)
      )
    : [];
  const selectedQuantities = props.allQuantityData
    ? props.allQuantityData.map((item) => item.quantity)
    : [];
  return (
    <Form onFinish={props.handle_submit}>
      <Form.Item rules={[{ required: true }]}>
        <Input
          placeholder="Enter recipe name"
          defaultValue={
            props.default_recipe_name ? props.default_recipe_name : null
          }
          onChange={(e) => props.recipe_name_setter(e.target.value)}
        />
      </Form.Item>
      <Form.Item>
        {props.currentIngredientsAndQuantities &&
        props.currentIngredientsAndQuantities ? (
          <>
            {props.default_ingredients.map((index) => {
              <div
                key={selectedIngredientNames[index]}
                style={{ display: "flex", alignItems: "center" }}
              >
                <>
                  <Select
                    placeholder="Ingredient Name"
                    onSelect={(value) =>
                      props.handle_ingredient_change(index, "name", value)
                    }
                    options={props.all_ingredient_names}
                    style={{ marginRight: 8 }}
                    defaultValue={selectedIngredientNames[index]}
                  />

                  <InputNumber
                    placeholder="Enter quantity"
                    defaultValue={selectedQuantities[index]}
                    onChange={(value) =>
                      props.handle_ingredient_change(index, "quantity", value)
                    }
                    style={{ marginRight: 8 }}
                  />
                  {index >= 0 && (
                    <Button
                      type="link"
                      onClick={() => props.remove_ingredient(index)}
                      icon={<MinusCircleOutlined />}
                    />
                  )}
                </>
                ;
              </div>;
            })}
          </>
        ) : (
          props.ingredients.map((ingredient, index) => (
            <div key={index} style={{ display: "flex", alignItems: "center" }}>
              <Select
                placeholder="Ingredient Name"
                onSelect={(value) =>
                  props.handle_ingredient_change(index, "name", value)
                }
                options={props.all_ingredient_names}
                style={{ marginRight: 8 }}
                defaultValue={undefined}
              />

              <InputNumber
                placeholder="Enter quantity"
                defaultValue={
                  props.default_ingredients ? ingredient.quantity : 1
                }
                onChange={(value) =>
                  props.handle_ingredient_change(index, "quantity", value)
                }
                style={{ marginRight: 8 }}
              />
              {index >= 0 && (
                <Button
                  type="link"
                  onClick={() => props.remove_ingredient(index)}
                  icon={<MinusCircleOutlined />}
                />
              )}
            </div>
          ))
        )}
        <Button
          type="dashed"
          onClick={props.add_ingredient}
          style={{ marginTop: 8 }}
        >
          Add Ingredient
        </Button>
      </Form.Item>
      <Form.Item>
        <Segmented
          options={props.category_options.map((option) => ({
            label: option,
            value: option,
          }))}
          defaultValue={props.default_category ? props.default_category : null}
          onChange={(e) => props.category_setter(e)}
        />
      </Form.Item>
      <Form.Item>
        <TextArea
          showCount
          maxLength={50}
          defaultValue={props.default_how_to ? props.default_how_to : null}
          onChange={(e) => props.how_to_setter(e.target.value)}
          placeholder="How To"
        />
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit">
          Add Recipe
        </Button>
      </Form.Item>
    </Form>
  );
};

export default DefaultForm;
