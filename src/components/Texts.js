import React, {Component } from 'react';
import {Spinner, ButtonGroup,Container,Table, Button, Row, Col } from 'react-bootstrap';

import FormTable from './FormTable';
import SideBar from './SideBar';

class Text extends Component{


	componentDidMount(){
		fetch("http://me-do.cl/backend/api/texts/")
			.then(response => response.json())
			.then(parsedJson => {
				if(parsedJson['error'] ){
					//this.props.history.push('/');
					console.log("parsedJson> ",parsedJson);
				}else{
					this.setState({data:parsedJson,load:false});
				}
			});
	}

	constructor(props){
		super(props);
		this.state = {
			data:{},
			load: true
		}
	}

	render(){
		
		if(this.state.load){
			return( <center> <h1>  <br/> <br/><br/> </h1> <Spinner style={{'width': '6rem','height': '6rem'}} animation="border" variant="primary" /> </center> )

		}else{
			return(
				<div className="wrapper">

					<SideBar/>
					<Container> 
					<center>

						<h1>  <br/>  </h1>
						
						<FormTable data={this.state.data}/>
						
						<br/><br/> 
					</center>
					</Container>
				</div>

			)
		}

		



	}

}


export default Text;