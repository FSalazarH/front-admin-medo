import React, {Component } from 'react';
import {Fade, Button } from 'react-bootstrap';


class SideNav extends Component{

	
	componentWillMount(){
	}
	constructor(props, context) {
		super(props, context);
		this.state = {
			route: window.location.href.split("/")[3],
			views:{"Home":"Inicio","Collections":"Collecciones","Designers":"Diseñadores","Base":"Base","About":"Acerca de Nosotros","Freq":"Preguntas frecuentes","Service":"Servicio al cliente","Terms":"Terminos y condiciones","Contact":"Contact"}
		};
	  }

  

	render(){

		var Views = this.state.views;
		var keys= Object.keys(Views);
		var route = this.state.route;

		const listViews = keys.map((key) => {
			var element = Views[key];
			if(route == key){
				return(
					<li key={key} className="active">
						<a  href={key}>{element}	</a>
					</li>
	
				)
			}else{
				return(
					<li key={key}>
						<a href={key}>{element}	</a>
					</li>
	
				)
			}
			
		});


		return(
				



					<nav id="sidebar">
						<div className="sidebar-header">
							<h3>me do</h3>
							{/* <img  src= {window.location.origin + '/img/logo.png'}  className="responsive-img"/> */}
						</div>
						<ul className="list-unstyled components">
						{listViews}
						</ul>

					
					</nav>


				
		)



	}

}


export default SideNav;