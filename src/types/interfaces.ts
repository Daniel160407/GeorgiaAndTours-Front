//props
export interface SortBySelectorProps {
  value: string;
  setValue: (value: string) => void;
}

export interface SearchProps {
  value: string;
  setValue: (value: string) => void;
  onSubmit: () => void;
}

export interface LanguageSwitcherProps {
  value: string;
  setValue: (value: string) => void;
}

export interface AdminToursListProps {
  tours: Tour[];
  onEdit: (tour: Tour) => void;
  onDelete: (id: string) => void;
  onNewTour: (tour: Tour) => void;
}

export interface ClientChatProps {
  userEmail: string;
  formData: any;
  setShowForm: React.Dispatch<React.SetStateAction<boolean>>;
}

//objects
export interface Tour {
  id: number;
  name: string;
  direction: string;
  duration: string;
  price: string;
  imageUrl: string;
  description?: string;
  requirements?: string;
  language?: string;
  status?: string;
}

export interface Translations {
  [key: string]: {
    descriptionTitle: string;
    aboutTitle: string;
    detailsTitle: string;
    duration: string;
    price: string;
    direction: string;
  };
}

export interface MessageObj {
  id?: number | string;
  senderEmail: string;
  receiverEmail: string;
  sender: string;
  receiver: string;
  subject?: string;
  payload: string;
  date?: string;
}

export interface ServerMessage {
  senderEmail: string;
  sender: string;
  receiver?: string;
  subject?: string;
  payload: string;
}

export interface User {
  id?: number | string;
  email: string;
  name?: string;
}

export interface UserFormData {
  name: string;
  email: string;
  password: string;
}
