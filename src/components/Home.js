import React, {Component } from 'react';
import {Spinner, ButtonGroup,Container,Table, Button, Row, Col } from 'react-bootstrap';

import FormTable from './FormTable';
import SideBar from './SideBar';

class Home extends Component{


	componentDidMount(){

		// check if user logged in
		/*
		fetch("http://me-do.cl/backend/api/texts/")
			.then(response => response.json())
			.then(parsedJson => {
				if(parsedJson['error'] ){
					//this.props.history.push('/');
					console.log("parsedJson> ",parsedJson);
				}else{
					this.setState({data:parsedJson,load:false});
				}
			}); */
	}

	constructor(props){
		super(props);
		this.state = {
			data:{},
			load: false
		}
	}

	render(){
		
		if(this.state.load){
			return( <center> <h1>  <br/> <br/><br/> </h1> <Spinner style={{'width': '6rem','height': '6rem'}} animation="border" variant="primary" /> </center> )

		}else{
			return(
				<div className="wrapper">

					<SideBar  history={this.props.history}/>
					<Container> 
					<center>

						<h1>  Benvenido  </h1>
						
						
						
						<br/><br/> 
					</center>
					</Container>
				</div>

			)
		}

		



	}

}


export default Home;