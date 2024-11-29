export interface CoordinatesInterface {
    latitude: number;
    longitude: number;
}

export interface NoteInterface {
    id: string;
    title: string;
    content: string;
    imageUrl: string;
    coordinates: CoordinatesInterface;
    createdAt: number;
    updatedAt: number;
}