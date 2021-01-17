import React , { useState } from 'react';
import {storageService , dbService } from 'fbase';
import { v4 as uuidv4} from 'uuid';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faTimes  } from "@fortawesome/free-solid-svg-icons";




const NweetFactory = ( {userObj })=>{
    //Nweet 맨션
    const [nweet , setNweet]  = useState("");    
    //Nweet 맨션 첨부파일
    const [attachment, setAttachment] = useState("");
    
    const onSubmit = async (event) => {        
        
        if (nweet === "") {
            return;
        }

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


    const onChange = (event) => {
        const { 
            target : {value} ,
        } = event ;
        setNweet(value);
    } ; 


    const onClearAttachment = () =>  setAttachment(""); 
    

    return (        
        <form onSubmit={onSubmit} className="factoryForm">
             <div className="factoryInput__container">
                <input
                className="factoryInput__input"
                value={nweet}
                onChange={onChange}
                type="text"
                placeholder="어떤생각을 하시죠?"
                maxLength={120}
                />
                <input type="submit" value="&rarr;" className="factoryInput__arrow" />
            </div>           
            
            <label for="attach-file" className="factoryInput__label">
                <span>Add photos</span>
                <FontAwesomeIcon icon={faPlus} />
            </label>
            <input       
                id="attach-file"
                type="file"
                accept="image/*"
                onChange={onFileChange}
                style={{
                opacity: 0,
                }}
            />            
            {attachment &&
                <div className="factoryForm__attachment">
                    <img
                        src={attachment}
                        style={{
                            backgroundImage: attachment,
                        }}
                    />
                    <div className="factoryForm__clear" onClick={onClearAttachment}>
                        <span>Remove</span>
                        <FontAwesomeIcon icon={faTimes} />
                    </div>
                </div>
            }                 
        </form>       
    ) ;
};

export default  NweetFactory;

