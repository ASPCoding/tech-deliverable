import "./App.css";
import quotebook from './assets/quotebook.png';
import { useState } from "react";

function App() {
	const [time, setTime] = useState("Last Week");
	const [quotes, setQuotes] = useState([{}]);

	function handleChange(e){
		console.log(e.target.value);
		setTime(e.target.value);
	}
	
	async function fetchQuotes(){
		console.log("hi");
		const response = await fetch(`http://localhost:5173/api/quote/${time}`);
		const data = await response.json();
		
		return data
	}

	function handleSubmit(e){
		e.preventDefault();
		fetchQuotes().then(
			data => {console.log(data);	
				setQuotes(data);
				});
		console.log(quotes);
	}

	function getQuotes(){
		return (
				<div id="allQuotes">
          {quotes.map((item) => (
						<div>
							<div id="quote">
							{item["time"]}
							</div>
							<div>
							{item["name"]}
							</div>
							<div>
							{item["message"]}
							</div>
							<div id="spacer"/>
						</div>
          ))}
				</div>)
	}

	return (
		<div className="App">
			{/* TODO: include an icon for the quote book */}
			<div id="header">
			 	<img src={quotebook} id="image"/>
				<h1>Hack at UCI Tech Deliverable</h1>
			</div>

			<div className="quoteDisplay">

				<div id="submitQuotes">
					<div id="submitTitle">
					<h2>Submit a quote</h2>
					</div>
					{/* TODO: implement custom form submission logic to not refresh the page */}
					
					<div id="postForm">
						<form action="/api/quote" method="post">
							<div id="formElement">
								<label htmlFor="input-name">Name</label>
								<input type="text" name="name" id="input-name" required />
							</div>
							<div id="formElement">
								<label htmlFor="input-message">Quote</label>
								<input type="text" name="message" id="input-message" required />
							</div>
							<div id="formElement">
								<button type="submit">Submit</button>
							</div>	
						</form>
					</div>
				</div>

				<div>
					<h2>Previous Quotes</h2>
					{/* TODO: Display the actual quotes from the database */}
					<form id="noRefresh" action="/api/quote" method="get" onSubmit={handleSubmit}>
						<label htmlFor="time-range-select">Time Range</label>
						<select id="time-range-select" name="times" required onChange={handleChange}>
							<option value="Last Week">Last Week</option>
							<option value="Last Month">Last Month</option>
							<option value="Last Year">Last Year</option>
							<option value="All">All</option>
						</select>
						<button type="submit">Submit</button>

					</form>
					<div className="messages">
						{getQuotes()}
					</div>
				</div>
			</div>
		</div>
	);
}

export default App;
