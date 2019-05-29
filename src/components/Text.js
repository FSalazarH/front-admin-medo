import React, {Component } from 'react';
import {Spinner, Breadcrumb ,Container,Table, Button, Row, Col } from 'react-bootstrap';

import FormTable from './FormTable';
import SideBar from './SideBar';


class Text extends Component{


	componentDidMount(){
		// "http://me-do.cl/backend/api/texts/"
		console.log("for here");
		console.log(this.state.view);
		fetch("http://me-do.cl/backend/api/texts?filter[where][view]=" + this.state.view)
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
			view: this.props.match.params.view,
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

						<br/>
						<Breadcrumb>
						<Breadcrumb.Item> {this.state.view} </Breadcrumb.Item>
						<Breadcrumb.Item active>textos </Breadcrumb.Item>
						</Breadcrumb>


						<FormTable data={this.state.data}/>
						
						<br/><br/> 

					</Container>
				</div>

			)
		}

		



	}

}


export default Text;