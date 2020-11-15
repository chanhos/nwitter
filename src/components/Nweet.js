import React , { useState } from 'react';
import { dbService } from 'fbase';

const Nweet = ( {nweetObject , isOwner} ) => { 
    const [editing , setEditing] = useState(false);
    const [newNweet, setNewNweet] = useState(nweetObject.text);

    const onDeleteClick = async (event) =>{
        const ok = window.confirm("Are you sure you wanna delete this nweet");
        if (ok)
        {
            //delete Nweet
           await dbService.doc(`nweets/${nweetObject.id}`).delete();
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
    <div>
        {
            editing ? (
              <>
                { isOwner && (
                <>
                     <form onSubmit={onNweetSubmit}>
                    <input 
                        type="text"
                        placeholder="Edit your nweet"
                        value={newNweet} 
                        required
                        onChange={onNewNweetChange}
                    />
                    <input type="submit" value="Update That Shit"/> 
                    </form>                
                    <button onClick={toggleEditing}>Cancel</button>
                </>
                )}
              </>  
            ) : (
              <>
                <h4>{nweetObject.text}</h4>
                {nweetObject.attachmentUrl && <img src={nweetObject.attachmentUr} width="300px" height="300px" />}
                {isOwner && ( 
                <> 
                    <button onClick={onDeleteClick}>DeleteNweet</button>      
                    <button onClick={toggleEditing}>EditNweet</button>
                </>  
                )}
              </>
            )
        }
    </div>
    
    );

} ; 

export default Nweet;