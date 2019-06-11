import React, {Component } from 'react';
import {Spinner, Breadcrumb ,Container,Table, Button, Row, Col } from 'react-bootstrap';
import SideBar from './SideBar';

class Images extends Component{


	componentDidMount(){

		// check if user logged in
        //"http://me-do.cl/backend/api/images/

		fetch("http://me-do.cl/backend/api/images?filter[where][view]=" + this.state.view)
			.then(response => response.json())
			.then(parsedJson => {
                console.log("aqui ",parsedJson);
				if(parsedJson['error'] ){
					//this.props.history.push('/');
					console.log("parsedJson> ",parsedJson);
				}else{
                    
                    this.setState({data:parsedJson,load:false});
                    console.log("AQUI: 2",parsedJson);
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
            var data = this.state.data;
            console.log("DATA", data);
            
            const listImage = data.map((element,i) => {
               
				return( <Col> 
                        <img 
                            src={"https://me-do.cl" + element.route}
                            alt="new" height="420" width="420"
                        /> 
                        <br/> 
                         
                        <br/>
                          <form className="md-form">
                            <div className="custom-file">
                               <Row>
                                    <Col> <label className="custom-file-label" for="validatedCustomFile"> Choose file...</label>
                                <input type="file" className="custom-file-input" id="validatedCustomFile" required/>
                                <div className="invalid-feedback">Example invalid custom file feedback</div> </Col>
                                    <Col>   <Button  variant="dark" > Actualizar  </Button>  </Col>
                                
                                </Row>
                                
                            </div>

                          
                            
                            </form>
                            <br/>
                       
                        

                        </Col> 
                        
                    );
			});


			return(
                

				<div className="wrapper">

					<SideBar  history={this.props.history}/>
                    <Container>
                    <br/>
						<Breadcrumb>
						<Breadcrumb.Item> {this.state.view} </Breadcrumb.Item>
						<Breadcrumb.Item active>textos </Breadcrumb.Item>
						</Breadcrumb>
					    <h3>Vista: {this.state.view} </h3>
                        <Row> 
                        {listImage}
                        </Row>
                        
                    </Container>

				</div>

			)
		}

		



	}

}


export default Images;