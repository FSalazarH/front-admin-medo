import React, {Component } from 'react';
import axios from 'axios';

class exportFile extends Component{


	
		constructor(props){
			super(props);
			this.state = {
				file:null
			};
			this.handleChange = this.handleChange.bind(this);
			this.fileUploadHandler = this.fileUploadHandler.bind(this);
		} 
	
		handleChange = event => {
			this.setState({
				file:event.target.files[0]
			});


		}
			
		

		fileUploadHandler = ()=>{
			console.log("HANDLEEER",this.state);
			//axios.post()
			const fd = new FormData();

			fd.append('image',this.state.file, this.state.file.name);
			console.log("here",fd);
			var config = { headers: { 'Content-Type': 'multipart/form-data' } };
			
			
			axios.post('http://localhost:3001/upload',fd,config).then(res => {
				console.log(res);
			});

		}
	
		render ()
		{
			return <div>
				<input type="file" name="image" onChange={ this.handleChange} />
				<button onClick={this.fileUploadHandler}> asd </button>

				<form method='post' action='http://localhost:3001/upload' enctype='multipart/form-data'>
				<input type='file' name='image'/>
				<input type='submit' />
			</form>
			</div>;

			
		}

}


export default exportFile;