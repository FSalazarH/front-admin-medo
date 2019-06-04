import React, {Component } from 'react';
import {Spinner, Breadcrumb ,Modal,Container, ButtonGroup, Button, Row, Col, Card } from 'react-bootstrap';
import SideBar from './SideBar';
import axios from 'axios';
import Image from './Image';
import SweetAlert from "react-bootstrap-sweetalert";
import FormTable from './FormTable';

class About extends Component{


	componentDidMount(){

		// check if user logged in
        var urlServer = "http://me-do.cl/backend/";
        //var urlServer = "http://localhost:3001/";
        //var config = { headers: { 'Access-Control-Allow-Methods':'*','Content-Type': 'application/json' } }
        var textRequest  =   axios.get( urlServer+'api/texts?filter[where][view]=about');
        var imagesRequest = axios.get( urlServer+'api/images?filter[where][view]=about');

        //then all request save results in state
         Promise.all([imagesRequest,textRequest]).then((results) => {
            console.log(results);
            this.setState({images:results[0]['data'],texts:results[1]['data'],load:false });
          })
          .catch(function(error){
            this.setState({showError:true});
            console.log("ERROR ",error);
            console.log("ERROR response ",error.response);
            console.log("ERROR request ",error.request);
        });

	}

	constructor(props){
		super(props);
		this.state = {
            images:[],
            texts:[],
            load: true,
            handleClose:false,
            forms:{"text_en":"Texto EN","text_es":"Texto ES","text_it":"Texto IT"},
            params:{},
            target:0,
            showError:false,showConfirm:false
        };


        this.delete = this.delete.bind(this);
        this.hideAlert= this.hideAlert.bind(this);
    }


    delete(){
        console.log("deleting!");

        var listRequest = [];
        console.log(this.state);
        var id = this.state.images[this.state.target].id;
        var urlServer = "http://me-do.cl/backend/";
        //var urlServer = "http://localhost:3001/";

        var config = {'content-type': 'application/json'};
        listRequest.push(axios.delete(urlServer + "api/slider_images/"+ id.toString(), { data: {} }));
        listRequest.push(axios.post(urlServer+ "deleteFolder",{url: this.state.images[this.state.target].image},config));
       
        console.log(listRequest);
        Promise.all(listRequest).then((res) => {
            console.log("result ",res);
            this.setState({showConfirm:true});
            window.location.reload(); 

         }).catch(() => { console.log('failed!'); this.setState({showError:true}); });      


       
    }

    hideAlert(){
        this.setState({showDelete:false,showError:false,showConfirm:false});
    }

    render(){
		
		if(this.state.load){
			return( <center> <h1>  <br/> <br/><br/> </h1> <Spinner style={{'width': '6rem','height': '6rem'}} animation="border" variant="primary" /> </center> )

		}else{

            var required = [{'name':'slider_id','parameter':0}];

            var listAbout = this.state.images.map((element,i) => {

                var params = element;
                //var urlserver = "http://localhost:8080";
                var urlserver = "https://me-do.cl/";
               

                return( 
                        <Col key={i} xs={12} md={12} lg={12}>
                            <Row>
                                <Col  xs={4} md={4} lg={4}>
                                    <Card>
                                        
                                        <Card.Header>{element.key} </Card.Header>
                                        <Card.Body>
                                            <Image size={"200"} getUrl={urlserver   + element.route} uploadUrl={element.route }   />
                                        </Card.Body>
                                    </Card>
                                </Col  >
                            
                                <Col xs={6} md={6} lg={6}>
                                    <br/>  
                                    <FormTable data={this.state.texts.slice(0,5)}/>
                                    
                                </Col>
                            </Row>
                        </Col>
                )
            });

            return(	
                <div className="wrapper">
                    <SideBar/>
                    <Container> 

                        <br/>
                        <Row>
                            {listAbout}
                        </Row>

                    </Container> 

                    {/* Sweet alert success changes  */}
                    <SweetAlert 
                        show={this.state.showConfirm} 
                        success 
                        title="Cambios guardados correctamente!" 
                        onConfirm={this.hideAlert} 
                        closeOnClickOutside={true}>
                    </SweetAlert>
                    {/* Sweet alert Error  */}
                    <SweetAlert 
                        show={this.state.showError } 
                        danger 
                        title="A ocurrido un error :(" 
                        onConfirm={this.hideAlert} 
                        closeOnClickOutside={true}>
                    </SweetAlert>

                </div>
            ); 
        }

		



	}

}


export default About;