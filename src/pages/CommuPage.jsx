import { useState } from 'react'
import { StyledParagraph } from "./CommuPage.styles.js"

function CommuPage() { 
    const [count, setCount] = useState(0)
  
    return (
      <>
        <StyledParagraph>
          유림
        </StyledParagraph>
      </> 
    )
  }

export default CommuPage;
