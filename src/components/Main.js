import React from 'react';
import {BrowserRouter,Switch,Route,Redirect} from 'react-router-dom';
import Login from './Login';
import Text from './Text';
import Images from './Images';
import SideBar from './SideBar';
import Collections from './Collections';
import CollectionsParts from './CollectionsParts';
import CollectionsParams from './CollectionsParams';
import CollectionsImages from './CollectionsImages';
import Sliders from './Sliders';
import Designers from './Designers';
import '.././App.css'; 


const Main = () => (
	<main>
	
			<BrowserRouter>
				<Switch>
					<Route exact path="/collections" component={Collections} />
					<Route exact path="/collections/parts/:collectionsSlug/:collectionsId" component={CollectionsParts} />
					<Route exact path="/collections/params/:collectionsSlug/:collectionsId" component={CollectionsParams} />
					<Route exact path="/collections/images/:collectionsSlug/:collectionsId" component={CollectionsImages} />
					<Route exact path="/bar" component={SideBar} />
					<Route exact path="/" component={Login} />
					<Route exact path="/designers" component={Designers} />

					<Route path="/:view/text" component={Text} />
					<Route path="/:view/images" component={Images} />
					<Route exact path="/home" component={Sliders} />

					<Route exact path="/about" render={() => (<Redirect to="/About/text"/>)} />
					<Route exact path="/service" render={() => (<Redirect to="/Service/text"/>)} />
					<Route exact path="/contact" render={() => (<Redirect to="/Contact/text"/>)} />
					<Route exact path="/base" render={() => (<Redirect to="/Base/text"/>)} />
					<Route exact path="/freq" render={() => (<Redirect to="/Freq/text"/>)} />
					<Route exact path="/Terms" render={() => (<Redirect to="/Terms/text"/>)} />

				</Switch>
				
			</BrowserRouter>
		
	</main>

	)


export default Main;
