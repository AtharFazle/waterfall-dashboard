import { apiClient } from "@/lib/axios";
import { CreateImagePayload, Image } from "@/types/images";

export const storeImage = async (data: CreateImagePayload) => {
    // Create FormData for file upload
    const formData = new FormData();

    console.log(data.image)
    
    // Append image file
    if (data.image instanceof File) {
        console.log(data.image,'image')
        formData.append('image', data.image);
    }
    
    // Append other fields
    formData.append('title', data.title);
    formData.append('description', data.description);

    if(data.order){
        formData.append('order', data.order.toString());
    }
    formData.append('is_active', data.isActive ? '1' : '0');

    const response = await apiClient.post<Image>(`/images`, formData);
    return response.data;
};

export const swapOrdering = async ({targetId, draggedId}: {targetId: number, draggedId: number}) => {
    const response = await apiClient.put(`/images/ordering`, {
        target_id: targetId, // Fixed typo: was "targed_id"
        dragged_id: draggedId
    });
    return response.data;
};

export const updateImage = async ({data, id}: {id: number, data: Partial<CreateImagePayload>}) => {
    // Create FormData for file upload in update
    const formData = new FormData();
    
    // Only append image if it's a new file
    if (data.image instanceof File) {
        formData.append('image', data.image);
    }
    
    // Append other fields

    if(data.title) {
        formData.append('title', data.title);
    }

    if(data.description){
        formData.append('description', data.description);
    }

    if(data.order){
        formData.append('order', data.order.toString());
    }
    formData.append('is_active', data.isActive ? '1' : '0');
    
    // Use PATCH method instead of POST for updates
    const response = await apiClient.post<Image>(`/images/patch/${id}`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return response.data;
};

export const getImages = async () => {
    const response = await apiClient.get<Image[]>('/images');
    return response.data;
};

export const toggleImagesActive = async ({id,isActiveNow} : {id: number, isActiveNow: boolean}) => {
    const data: Partial<CreateImagePayload> = { isActive: !isActiveNow  };
    return updateImage({ id, data });
};

export const deleteImages = async (id: number) => {
    const response = await apiClient.delete<Image>(`/images/${id}`);
    return response.data;
};