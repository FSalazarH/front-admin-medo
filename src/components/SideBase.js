import React, {Component } from 'react';
import {Fade, Button } from 'react-bootstrap';


class SideBase extends Component{

	
	componentWillMount(){


	}
	constructor(props, context) {
		super(props, context);
	
		this.state = {
			"Base":false, "Address":false, "Freq":false, "Terms":false, "About":false, "Register":false, "Home":false, "Collections":false, "Collection":false, "Gallery":false, "Cart":false, "Configurator":false, "Checkout":false, "My account":false, "Contact":false, "Designer":false, "Configurator":false, "My design":false, "Edit my design":false, "Popup confirmar":false, "Gallery design":false, "Register":false, "Edit cart":false
		};
	  }

	render(){

		var Views = ["Home","Base", "Address", "Freq", "Terms", "About", "Register", "Collections", "Collection", "Gallery", "Cart", "Configurator", "Checkout", "My account", "Contact", "Designer", "Configurator", "My design", "Edit my design", "Popup confirmar", "Gallery design", "Register", "Edit cart"];

		var st = this.state;
		const listViews = Views.map((element,i) => {
			
			return(
			
				<li>
					<Button variant="secondary"
					onClick={() => {var open=this.state[element]; this.setState({ element:!open }); console.log(open,element,this.state); } }
					aria-controls={"menu" + i.toString()}
					aria-expanded={"menu" + i.toString()}
					>
					{element}
					</Button >
					<li className="active">
						<Fade in={this.state.Base}>
							<ul className="collapse list-unstyled" id={"menu" +i.toString()} style={{'background':'#282c34'}}>
								<li>
									<a href={"/text/" + element}> Textos </a>
								</li>
								<li>
									<a href={"/images/" + element}> Imagenes </a>
								</li>
							</ul>
						</Fade>					
					</li>
				</li>



			)
		});


		return(
				



					<nav id="sidebar">
						<div className="sidebar-header">
							<h3>me do</h3>
						</div>
						<ul className="list-unstyled components">
						{listViews}
						</ul>

					
					</nav>


				
		)



	}

}


export default SideBase;