import AudiobooksRender from "./AudiobooksRender";
import { Audiobook } from "./types";

const Audiobooks = () => {
    const audiobooks: Audiobook[] = []

    return (
        <>
            <AudiobooksRender audiobooks={audiobooks} />
        </>
    )
}

export default Audiobooks;