import React, { Component } from "react";
import FileUpload from "./FileUpload";
import Child1 from "./Child1";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [
        {"Date": new Date("2024-01-01T00:00:00"), "GPT-4": 120, "Gemini": 20, "PaLM-2": 90, "Claude": 50, "LLaMA-3.1": 60},
        {"Date": new Date("2024-02-01T00:00:00"), "GPT-4": 130, "Gemini": 75, "PaLM-2": 35, "Claude": 60, "LLaMA-3.1": 70},
        {"Date": new Date("2024-03-01T00:00:00"), "GPT-4": 50, "Gemini": 50, "PaLM-2": 95, "Claude": 65, "LLaMA-3.1": 80},
        {"Date": new Date("2024-04-01T00:00:00"), "GPT-4": 100, "Gemini": 65, "PaLM-2": 80, "Claude": 70, "LLaMA-3.1": 90},
        {"Date": new Date("2024-05-01T00:00:00"), "GPT-4": 60, "Gemini": 50, "PaLM-2": 150, "Claude": 75, "LLaMA-3.1": 100},
        {"Date": new Date("2024-06-01T00:00:00"), "GPT-4": 100, "Gemini": 55, "PaLM-2": 60, "Claude": 80, "LLaMA-3.1": 110},
        {"Date": new Date("2024-07-01T00:00:00"), "GPT-4": 180, "Gemini": 50, "PaLM-2": 130, "Claude": 85, "LLaMA-3.1": 120},
        {"Date": new Date("2024-08-01T00:00:00"), "GPT-4": 190, "Gemini": 45, "PaLM-2": 100, "Claude": 90, "LLaMA-3.1": 130},
        {"Date": new Date("2024-09-01T00:00:00"), "GPT-4": 200, "Gemini": 40, "PaLM-2": 50, "Claude": 95, "LLaMA-3.1": 140},
        {"Date": new Date("2024-10-01T00:00:00"), "GPT-4": 110, "Gemini": 135, "PaLM-2": 80, "Claude": 100, "LLaMA-3.1": 150}
    ]
    };
  }

  set_data = (csv_data) => {
    const s = csv_data
    this.setState({ data: csv_data });
    console.log(s)
  }

  render() {
    return (
      <div>
        <FileUpload set_data={this.set_data}></FileUpload>
        <div className="parent">
          <Child1 csv_data={this.state.data}></Child1>
        </div>
      </div>
    );
  }
}

export default App;
