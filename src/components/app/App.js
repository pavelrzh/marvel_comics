import { lazy, Suspense } from "react";
import{BrowserRouter as Router, Route, Routes} from "react-router-dom";
// import {CSSTransition} from 'react-transition-group';
import AppHeader from "../appHeader/AppHeader";
import Spinner from "../spinner/Spinner";

const SingleComicLayout = lazy(() => import('../pages/singleComicLayout/SingleComicLayout'));
const SingleCharacterLayout = lazy(() => import('../pages/singleCharacterLayout/SingleCharacterLayout'));
const SinglePageLogic = lazy(() => import('../pages/SinglePageLogic'));
const ComicsPage = lazy(() => import('../pages/ComicsPage'));
const MainPage = lazy(() => import('../pages/MainPage'));
const Page404 = lazy(() => import('../pages/404'));



const App = () => {

    return (
        <Router>
            <div className="app">
                <AppHeader/>
                <main>
                    <Suspense fallback={<Spinner/>}>
                        <Routes>
                            <Route path='/' element={<MainPage/>}/>
                            <Route path='/comics' element={<ComicsPage/>}/>
                            <Route path='/comics/:id' element={<SinglePageLogic Component={SingleComicLayout} dataType='comic'/>}/>
                            <Route path='/characters/:id' element={<SinglePageLogic Component={SingleCharacterLayout} dataType='character'/>}/>
                            <Route path= '*' element={<Page404/>}/>
                        </Routes>
                    </Suspense>
                </main>
            </div>
        </Router>
    )
    
}

export default App;