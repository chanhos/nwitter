import React , { useState } from 'react';
import { dbService, storageService } from 'fbase';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faPencilAlt } from "@fortawesome/free-solid-svg-icons";

const Nweet = ( {nweetObject , isOwner} ) => { 
    const [editing , setEditing] = useState(false);
    const [newNweet, setNewNweet] = useState(nweetObject.text);

    const onDeleteClick = async (event) =>{
        const ok = window.confirm("Are you sure you wanna delete this nweet");
        if (ok)
        {
            //delete Nweet
           await dbService.doc(`nweets/${nweetObject.id}`).delete();
           await storageService.refFromURL(nweetObject.attachmentUrl).delete();
        }
    }

    const toggleEditing = () => setEditing( (prev) => !prev) ; 
    
    const onNweetSubmit = async (event) => {
        event.preventDefault();
        await dbService.doc(`nweets/${nweetObject.id}`).update(
          {
              text : newNweet,              
          }  
        );
        setEditing(false);
    };

    const onNewNweetChange = (event)=> {
        const { 
            target : {value} ,
        } = event ;
        setNewNweet(value);
    }    

    return ( 
    <div className="nweet">
        {           
            editing ? (
              <>               
                <form onSubmit={onNweetSubmit} className="container nweetEdit">
                <input 
                    type="text"
                    placeholder="Edit your nweet"
                    value={newNweet} 
                    required
                    autoFocus
                    onChange={onNewNweetChange}
                    className="formInput"
                />
                <input type="submit" value="Update Nweet" className="formBtn"/> 
                </form>            
                <span onClick={toggleEditing} className="formBtn cancelBtn">
                    Cancel
                </span>                
              </>  
            ) : (
              <>
                <h4>{nweetObject.text}</h4>
                {nweetObject.attachmentUrl && <img src={nweetObject.attachmentUrl} />}
                {isOwner && ( 
                    <div class="nweet__actions">
                        <span onClick={onDeleteClick}>
                        <FontAwesomeIcon icon={faTrash} />
                        </span>
                        <span onClick={toggleEditing}>
                        <FontAwesomeIcon icon={faPencilAlt} />
                        </span>
                    </div> 
                )}
              </>
            )
        }
    </div>
    
    );

} ; 

export default Nweet;