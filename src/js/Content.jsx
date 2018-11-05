import React from "react";
import ReactDOM from "react-dom";
import { createStore } from 'redux'
import "../css/main.css"

class Title extends React.Component {
  constructor(props){
    super(props);
  }
  render() {
    return(
      <h2>{this.props.text}</h2>
    )
  }
}

class Input extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      inputValue:""
    }
  }
  render(){
    return(
    <form className="form-group" onSubmit={this.props.toSubmit}>
      <input
        type="text"
        className="input-box"
        id={this.props.id}
        placeholder="輸入待辦事項"
        onChange={this.props.toChange}
        value={this.props.inputValue}
      />
      <input type="submit" value="加入"/>
    </form>
    )
  }
}

class Item extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <div id={"item"+this.props.index}>
        <input 
          className="itemCheck"
          type="checkbox"
          checked={this.props.finished}
          onChange={() => this.props.onToggle && this.props.onToggle(this.props.finished,this.props.index)}
        />
        <span className={this.props.finished?"finished":"unfinished"}> {this.props.content} </span>
        <button onClick={() => this.props.delete && this.props.delete(this.props.index)}>X</button>
      </div>
    );
  }
}

class Application extends React.Component {
  constructor(props) {
    super(props);
    this.state = store.getState();
  }

  render() {
    let itemFilted = [];
    for(let i=0;i<this.state.todoList.length;i++){
      if(this.state.todoList[i].finished!==this.state.filter) {
        itemFilted.push(this.state.todoList[i]);
      }
    }

    let itemElements = itemFilted.map((item) => (
      <li key={item.index}>
        <Item
          index={item.index}
          content={item.content}
          finished={item.finished}
          onToggle={this.toggleState.bind(this)}
          delete={this.deleteItem.bind(this)}
        />
      </li>
    ));
    return (
        <div className="app">
          <Title text="To Do List App"/>
          <button onClick={() => this.changeFilter(1)}>未完成</button>
          <button onClick={() => this.changeFilter(0)}>已完成</button>
          <button onClick={() => this.changeFilter(-1)}>全部</button>
          <Input
            id="input-box"
            toSubmit={this.handleSubmit.bind(this)}
            toChange={this.handleChange.bind(this)}
            inputValue={this.state.inputValue}
          />
          {itemElements}
        </div>
    );
  }
  handleChange(e) {
    store.dispatch({
      type:"ChangeInputValue",
      inputValue:e.target.value
    })
  }
  handleSubmit(e) {
    e.preventDefault();
    store.dispatch({
      type:"SubmitItem",
    });
  }
  toggleState(oldState,index) {
    store.dispatch({
      type:"ToggleState",
      index,
      oldState
    });
  }
  deleteItem(index) {
    store.dispatch({
      type:"DeleteItem",
      index
    })
  }
  changeFilter(filter) {
    store.dispatch({
      type:"ChangeFilter",
      filter
    })
  }
  refresh(){
    this.setState(store.getState());
  }
  componentDidMount(){
    this.unsubscribe=store.subscribe(this.refresh.bind(this));
  }
  componentWillUnmount(){
    this.unsubscribe();
  }
}

let store;
let reducer = function(state,action) {
  switch(action.type){
    case "ChangeInputValue":
      return Object.assign({},state,{inputValue:action.inputValue});
    case "SubmitItem":
      if(state.inputValue){
        let newItem = {
          index: state.todoList.length,
          content: state.inputValue,
          finished: 0
        }
        state.todoList.push(newItem);
        return Object.assign({},state,{inputValue:""});
      } else {return state;}
    case "ToggleState":
      state.todoList[action.index].finished = Number(!action.oldState);
      return state;
    case "DeleteItem":
      state.todoList.splice(action.index,1);
      state.todoList.forEach((item,idx)=>{item.index=idx});
      return state;
    case "ChangeFilter":
      return Object.assign({},state,{filter:action.filter});
    default:
      return state;
  }
}

window.addEventListener("load", ()=>{
  store = createStore(reducer, {
    filter:1,
    todoList:[
      {
        index: 0,
        content: "吃飯",
        finished: 1
      },
      {
        index: 1,
        content: "買飲料",
        finished: 0
      }
    ],
    inputValue:""
  });
  const contDiv = document.getElementById("container");
  contDiv ? ReactDOM.render(<Application />, contDiv) : false;
})

export default Application;
