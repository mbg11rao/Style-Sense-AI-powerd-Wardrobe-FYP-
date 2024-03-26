import React, { useState, useEffect } from 'react';
import { useNavigate  } from 'react-router-dom';
import '../styles/AddClothPopUp.css';
import { go_back, edit_add_today } from '../styles/icons.js';
import { uploadPhotoAPI, deleteCloth, editCloth, addFromRecommend } from '../api/api.js'
import ChooseEventType from './ChooseEventType.js';
import { dbobj2obj, obj2dbobj } from '../api/api.js';

function AddClothPopUp({ selectedFile, selectedImage, onClose, eventTypes, clothType, forEdit, clothesType, clothesActivities, mongoID, setClothTypeFinal, setEventTypeFinal, setRefresh }) {
  // whether or not click on to select desired event
  const [isChooseEventTypeOpen, setIsChooseEventTypeOpen] = useState(false);
  // whether or not click on to select desired activities
  const [isChooseClothTypeOpen, setIsChooseClothTypeOpen] = useState(false);
  const [eventType, setEventType] = useState(clothesActivities ? dbobj2obj[clothesActivities] : "");
  const [type, setClothType] = useState(clothesType ? dbobj2obj[clothesType] : "");
  console.log("popup MongoID is !!!",mongoID)
  let navigate = useNavigate();

  const handleSelectActivity = (e) => {
    e.preventDefault();
    setIsChooseEventTypeOpen(!isChooseEventTypeOpen);
  }
  // Assuming 'userId' is the key used to store the ID

  const handleSelectClothType = (e) => {
    e.preventDefault();
    setIsChooseClothTypeOpen(!isChooseClothTypeOpen);
  }

  const handleUploadImage = async () => {
    console.log('Uploading image')
    if (mongoID) {
      setEventTypeFinal(obj2dbobj[eventType])
      setClothTypeFinal(obj2dbobj[type])
      await editCloth(mongoID, eventType, type);
      console.log("It's now editting hahaah")
      console.log("Event Type after handle upload imae:", eventType);
      console.log("Cloth Type after handle upload imae:", type);
     // window.location.reload();
    } else {
      console.log("Event Type after handle upload imae:", eventType);
      console.log("Cloth Type after handle upload imae:", type);
      await uploadPhotoAPI(selectedFile, type, eventType);
      //await editCloth(mongoID, eventType, type);
      console.log("event type le rha")
     // window.location.reload();
    }
    navigate('/closet')
  }

  const handleChangeType = async (event, selectedTypes) => {
    event.preventDefault();
    if (selectedTypes) {
      const activity = selectedTypes[0];
      setClothType(activity);
      handleSelectClothType(event);
    }
    console.log(type);
  }

  const handleChangeActivity = async (event, selectedTypes) => {
    event.preventDefault();
    console.log(event)
    if (selectedTypes) {
      const activity = selectedTypes[0];
      setEventType(activity);
      handleSelectActivity(event);
    }
    console.log(eventType)
  }

  const handleUpload = async () => {
    // Log to see if event type and type (cloth type) are defined
    console.log("Event Type at Upload:", eventType); // Should not be 'undefined'
    console.log("Cloth Type at Upload:", type); // Should not be 'undefined'

    if (eventType && type) {
        // Proceed with uploading the image and then saving data to MongoDB
        await uploadPhotoAPI(selectedFile, type, eventType);
    } else {
        // Handle the case where eventType or type is not selected
        alert("Please select both event type and cloth type before uploading.");
    }
};

  // const handleUpload = async () => {
  //   handleUploadImage();
  //   onClose();
  // }

  const handleRecommend = async () => {
    console.log("mongoID is!!!! haha", mongoID)
    await addFromRecommend(mongoID);
    //setRefresh(true);
    onClose();
    //window.location.reload()
  }

  const handleDelete = async () => {
    console.log("mongoID is!!!! haha", mongoID)
    await deleteCloth(mongoID)
    window.location.reload()
  }

  return (
    <div className="add-cloth-popup-flame">
      <div className="add-cloth-popup">
        <div className="add-cloth-pop-up-back">
          {forEdit ? <h3>Edit Clothes' Profile</h3> : <h3>Add to Closet</h3>}
          <button className="back-arrow" onClick={onClose}>Back</button>
        </div>
        <div className="image-block">
          <img className="uploaded-image" src={selectedImage} alt="Selected Cloth" />
        </div>
        <div className="add-cloth-attribute-container">
          <div className="add-cloth-attribute">
            <div className="add-cloth-attribute-label">Type</div>
            <div className="add-cloth-attribute-input">
              <div className='tags'>
                {/* {forEdit ? <button className="tag">{type.charAt(0).toUpperCase() + type.slice(1)}</button> : <button className="tag">{"Top"}</button>} */}
                {forEdit ? <button className="tag">{type}</button> : <button className="tag">{type}</button>}
              </div>
              <button className="edit" onClick={handleSelectClothType}>{edit_add_today}</button>
            </div>
          </div>
          <div className="add-cloth-attribute">
            <div className="add-cloth-attribute-label">Activity</div>
            <div className="add-cloth-attribute-input">
              <div className='tags'>
                {/* {forEdit ? <button className="tag">{eventType.charAt(0).toUpperCase() + eventType.slice(1)}</button> : <button className="tag">{"Casual"}</button>} */}
                {forEdit ? <button className="tag">{eventType}</button> : <button className="tag">{eventType}</button>}
              </div>
              <button className="edit" onClick={handleSelectActivity}>{edit_add_today}</button>
            </div>
          </div>
        </div>
        <div className="btns">
          {/* {forEdit ? <button className="btn-add">Save</button> : <button className="btn-add" onClick={handleUploadImage}>Add to Closet</button>} */}
          {forEdit ? <button className="btn-add" onClick={handleUpload}>Save</button> : <button className="btn-add" onClick={handleUploadImage}>Add to Closet</button>}
          {forEdit ? <button className="btn-cancel" onClick={handleDelete}>Delete</button> : <button className="btn-cancel" onClick={onClose}>Cancel</button>}
        </div>
        {isChooseEventTypeOpen && <ChooseEventType  handleAddToOutfit={handleChangeActivity} handleClosePopUp={handleSelectActivity} eventTypes={eventTypes} type={'activity'} chosen={eventType} />}
        {isChooseClothTypeOpen && <ChooseEventType  handleAddToOutfit={handleChangeType} handleClosePopUp={handleSelectClothType} eventTypes={clothType} type={'clothes'} chosen={type} />}
      </div>
    </div>
  );
}

export default AddClothPopUp;
