import React, { useState, useEffect } from "react";
import { dbService ,storageService  } from "fbase";
import Nweet from "components/Nweet";
import NweetFactory from "components/NweetFactory";


const Home = ( {userObj} ) =>{  
    const [nweets, setNweets] = useState([]) ; 

    /* For-Each Way ( More - Render)
    const getNweets = async () => {
        const dbNweets = await dbService.collection("nweets").get();
        dbNweets.forEach(document => {
            const nweetObject = {
                ...document.data(),
                id : document.id,
            };
            setNweets( (prev)=> [nweetObject, ...prev]);
        });
    };
    */

    useEffect( ()=>{
        //getNweets();
        dbService.collection("nweets").orderBy("createAt","desc").onSnapshot( snapShot =>{
            const nweetArray = snapShot.docs.map( (doc) => ({
                id : doc.id,
                ...doc.data(),
            }));
            setNweets(nweetArray);
        });
    }, []) ;    

   
    return (
        <div className="container">
            <NweetFactory userObj={userObj}/>            
            <div style={{ marginTop: 30 }}>
                {nweets.map( (nweet)=> (
                   <Nweet 
                    key={nweet.id} 
                    nweetObject={nweet}
                    isOwner={nweet.creatorId===userObj.uid} 
                   />
                ))}
            </div>
        </div>
    );
}; 
export default Home;