import React, { useState, useEffect } from "react";
import { dbService ,storageService  } from "fbase";
import Nweet from "components/Nweet";
import { v4 as uuidv4} from 'uuid';
import { ReportBase } from "istanbul-lib-report";


const Home = ( {userObj} ) =>{  
    const [nweet , setNweet]  = useState("");
    const [nweets, setNweets] = useState([]) ; 
    const [attachment, setAttachment] = useState();
    
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
        dbService.collection("nweets").onSnapshot( snapShot =>{
            const nweetArray = snapShot.docs.map( (doc) => ({
                id : doc.id,
                ...doc.data(),
            }));
            setNweets(nweetArray);
        });
    }, []) ;


    const onSubmit = async (event) => {        
        event.preventDefault();
        let attachmentUrl  = "";
        if (attachment !== "")
        {
            const attachmentRef = storageService.ref().child(`${userObj.uid}/${uuidv4()}`);
            const response =  await attachmentRef.putString(attachment, "data_url")
            console.log(response);
            attachmentUrl = await response.ref.getDownloadURL(); 
            console.log(attachmentUrl);           
        }
        
        const nweetObj = {
            text: nweet,
            createAt : Date.now(),
            creatorId : userObj.uid,
            attachmentUrl  
        }
        await dbService.collection("nweets").add(nweetObj);
        setNweet("");
        setAttachment("");
        /*await dbService.collection("nweets").add({
            text: nweet,
            createAt : Date.now(),
            creatorId : userObj.uid,

        });
        setNweet(""); */
    };

    const onChnage = (event) => {
        const { 
            target : {value} ,
        } = event ;
        setNweet(value);
    } ; 


    const onFileChange = (event) => {
        const { 
            target : { files },
        } = event ;
        const theFile = files[0];
        const reader = new FileReader();
        reader.onloadend = (finishedEvent) => {
            const { 
                currentTarget : { result },
            } = finishedEvent
            setAttachment(result);
            //console.log(attachment);
        };
        reader.readAsDataURL(theFile);
    };

    const onClaerAttachmentClick = () =>  setAttachment(null) 
    
    return (
        <div>
            <form onSubmit={onSubmit}>
                <input value={nweet} 
                       onChange={onChnage} 
                       type="text" 
                       placeholder="What's on your mind?" 
                       maxLength={120} 
                />
                <input type="file" accept="image/*" onChange={onFileChange}/>
                {attachment &&
                <div>
                    <img src={attachment} width="300px" height="300px"/> 
                    <button onClick={onClaerAttachmentClick}>Clear</button>
                </div>
                }
                <input type="submit" value="Nweet"/>
               
            </form>
            <div>
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