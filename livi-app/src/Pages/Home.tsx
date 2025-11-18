import { Page, PageContainer } from './styles'
import { useState } from 'react'
import MultiCitySelect from '../Components/MultiCitySelect/MultiCitySelect'
import Chip from '../Components/Chip'

export function Home() {
  const [selected, setSelected] = useState<string[]>([])
  const onDelete = (city: string) => {
    console.log('deleting', city)
    console.log("selected before", selected)
    setSelected(selected.filter(c => c !== city))
  }
  return (
    <Page>
      {/* <PageContainer> */}
      <h2>Find A Place to Stay</h2>
      <div style={{ marginTop: 5, marginBottom: 15, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        {selected?.map(city => {
          return <Chip key={city} label={city} onDelete={(e)=>{onDelete(e)}}/>
        })}
      </div>     
       <MultiCitySelect value={selected} onChange={setSelected} />

      {/* </PageContainer> */}
    </Page>
  )
}