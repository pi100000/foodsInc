import "../App.css";
import { Input } from "antd";
import {
  Select,
  Tag,
  Button,
  Modal,
  Segmented,
  InputNumber,
  TimePicker,
  Tooltip,
} from "antd";
const { TextArea } = Input;

const tagRender = (props) => {
  const { value, closable, onClose } = props;
  const onPreventMouseDown = (event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
  };
  return (
    <Tag
      color={"gold"}
      onMouseDown={onPreventMouseDown}
      closable={closable}
      onClose={onClose}
      style={{
        marginRight: 3,
      }}
    >
      {value}
    </Tag>
  );
};

const Form = (props) => {
  return (
    <>
      <h1>{props.pagetitle}</h1>
      <Input
        placeholder="Recipe Name"
        onChange={(e) => props.recipe_name(e.target.value)}
        style={{ width: "30%", margin: 4 }}
        defaultValue={
          props.default_recipe_name ? props.default_recipe_name : null
        }
      />
      <Segmented
        options={props.category_options.map((option) => ({
          label: option,
          value: option,
        }))}
        defaultValue={
          props.default_category ? props.default_category : "MainCourse"
        }
        onChange={(e) => props.category_setter(e)}
      />
      <br />
      <Button
        type="default"
        shape="circle"
        onClick={props.add_ingredient_modal}
      >
        +
      </Button>
      <Select
        mode="multiple"
        allowClear
        onSelect={(e) => props.select_ingredient(e)}
        onDeselect={(e) => props.deselect_ingredient(e)}
        style={{ width: "33%", paddingTop: 5, marginRight: 15, margin: 10 }}
        placeholder="Select Ingredients"
        defaultValue={
          props.default_ingredients ? props.default_ingredients : []
        }
        options={props.ingredient_options.map((option) => ({
          label: option,
          value: option,
        }))}
        tagRender={tagRender}
      />

      <Tooltip
        placement="topLeft"
        title={"how many hours will this dish be fresh to eat?"}
      >
        <InputNumber
          placeholder="moist meter"
          defaultValue={props.default_moisture ? props.default_moisture : null}
          style={{ marginTop: 20, width: "10%" }}
          onChange={(e) => props.moisture_setter(e)}
        />
      </Tooltip>
      <TextArea
        showCount
        maxLength={50}
        style={{
          height: 80,
          marginBottom: 24,
          marginLeft: "25%",
          width: "50%",
          paddingTop: 5,
        }}
        defaultValue={props.default_how_to ? props.default_how_to : null}
        onChange={(e) => props.how_to_setter(e.target.value)}
        placeholder="How To"
      />
      <Modal
        title="New Ingredient"
        open={props.new_ingredient_modal}
        onCancel={props.cancel_new_ingredient_modal}
        style={{ maxWidth: "20%" }}
        footer={[
          <Button key="back" onClick={props.cancel_new_ingredient_modal}>
            Cancel
          </Button>,
          <Button
            key="submit"
            type="primary"
            onClick={props.submit_new_ingredient}
          >
            Add
          </Button>,
        ]}
      >
        <Input
          placeholder="Ingredient Name"
          onChange={(e) => {
            props.new_ingredient_name_setter(e.target.value);
          }}
        />
      </Modal>
      {props.update_button ? null : (
        <Button
          disabled={props.submitValidation}
          onClick={props.submit_recipe_data}
        >
          Submit
        </Button>
      )}
      {props.update_button ? (
        <Button onClick={props.submit_recipe_data}>Update</Button>
      ) : null}
    </>
  );
};

export default Form;
