import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { getImageByImageId, getImageIdsByUserId, getPointsInRadius, getUserMapImagesByUserId } from "../../hooks/useChat"
import { getAvatars, getPointImageByPointId } from "../../utils/helpers/helperFuncs";
const filterDefined = (obj: any) => 
  Object.fromEntries(Object.entries(obj).filter(([_, value]) => _ !== undefined || (value as any).src));


export interface imagesActions {
    getImagesByImageIdsAction: (imageId: string[]) => void;
    getMapImagesByUserIdAction: (payload: {username: string, nav?: boolean}) => void;
    getImageIdsByUsernameAction: (username: string) => void;
    getAvatarsAction: (username: string) => void;
  }
  
  interface Image {
    id: string,
    owner: string,
    src: string,
    timestamp: any
  }

  interface Avatars {
    [any: string] : Image
  }

  interface Images {
    [any: string] : Image
  }

  type Ids = string[]
  


  interface MapImages {
    [id: string] : string
  }
  
 export interface ImagesState {
    images: Images | null;
    ids: Ids | null;
    mapimages: MapImages | null;
    avatars: Avatars | null;
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
  }
  
  const initialState: ImagesState = {
    images: null,
    ids: null,
    mapimages: null,
    avatars: null,
    status: 'idle',
    error: null,
  };
  const handleGetPostsImages = async (postIds: any[]) => {
    
      try {
        if (!postIds) {
          return 
        }
         let result: any = {}
          
        
      for (const post of postIds) {
        console.log('post : 64 : ', post)
        
        

       
        const res = await getImageByImageId(post);
        console.log('res : 70 : ', res['payload'])
        
        if (res['payload']) {
          
            
        
          result[res['payload'].id] = res.payload
          console.log('resu', res.payload.payload)
        }
      }
      
      console.log('result : 81 : ', result)
      
      return result
    } catch (e) {
      console.log('error : ', e  )
    }
  }
const getImagesByImageIdsAction = createAsyncThunk('images/images', async (imageIds: string[]) => {


    const result = await handleGetPostsImages(imageIds)
    console.log('result : 91 : ', result)

    

    return result
})

 
const getImageIdsByUsernameAction = createAsyncThunk('images/ids',async  (userData: any) => {
  

  const result = await getImageIdsByUserId(userData)
  return result.payload
})
 
const getMapImagesByUserIdAction = createAsyncThunk('images/mapimages', async (payload: {username: string, nav?: boolean}) =>{ 
    try {

        const mapImages = await getUserMapImagesByUserId(payload.username)
        const pointsInRaduis = await getPointsInRadius(
        {
          lat: 32.02119878251853,
          lng: 34.74333323660794,
        },
        false
      );
      
      if (payload.nav === true) {
        
// 
          let newMapimages = {};
          for (let pointId of Object.keys(pointsInRaduis.payload)) {
            let quadId =
              pointsInRaduis.payload[pointId].location.lat.toFixed(2) +
              ":" +
              pointsInRaduis.payload[pointId].location.lng.toFixed(2);
          
            const pointimage = await getPointImageByPointId(pointId, quadId);
            
            if (pointimage?.src) {
              newMapimages[pointsInRaduis.payload[pointId].data.icon] =
              pointimage.src;
            }
          }
          
          return {...mapImages.payload, ...newMapimages};
      }
      
      return mapImages.payload
    } catch (e)
    {
        
    }})
   

const getAvatarsAction = createAsyncThunk('images/avatars', async (friend: any) => {
    const avatt = await getAvatars(friend)
    console.log('avatt : 149 : ', avatt)
    
    return avatt
})
  

const imagesSlice = createSlice({
    name: 'images',
    initialState,
    reducers: {
        setAvatars(state, action: PayloadAction<Avatars>) {
      
            state.avatars = action.payload;
          },
          setImages(state, action: PayloadAction<Images>) {
      
            state.images = action.payload;
          },
          setMapImages(state, action: PayloadAction<MapImages>) {
      
            state.mapimages = action.payload;
          },
    },
    extraReducers: (builder) => {
      builder.addCase(getImagesByImageIdsAction.fulfilled, (state, action) => {
        state.images = action.payload
      });
    
      builder.addCase(getImageIdsByUsernameAction.fulfilled, (state, action) => {
        state.ids = action.payload;
        
      });
      builder.addCase(getMapImagesByUserIdAction.fulfilled, (state, action) => {
       
        state.mapimages = action.payload;
      });
      builder.addCase(getAvatarsAction.fulfilled, (state, action) => {
        
        state.avatars = action.payload[1]
      
      });
      
    },
  });
  
  export const imagesActions = { ...imagesSlice.actions, getImagesByImageIdsAction, getImageIdsByUsernameAction, getMapImagesByUserIdAction, getAvatarsAction };
  export const imagesReducer = imagesSlice.reducer;
  
  