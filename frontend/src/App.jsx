import "./App.css";
import quotebook from './assets/quotebook.png';
import { useState } from "react";

function App() {
	const [time, setTime] = useState("Last Week");

	function handleChange(e){
		console.log(e.target.value);
		setTime(e.target.value);
	}
	
	async function fetchQuotes(time){
		const response = await fetch(`http://localhost:5173/api/quote/Last Week`);
		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`);
		}
		const data = await response.json();
		console.log(data);
	}

	function handleSubmit(e){
		e.preventDefault();
		fetchQuotes(time);
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
					<h2>Submit a quote</h2>
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
						<p>Peter Anteater</p>
						<p>Zot Zot Zot!</p>
						<p>Every day</p>
					</div>
				</div>
			</div>
		</div>
	);
}

export default App;
