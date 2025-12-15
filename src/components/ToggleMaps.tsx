import { useState } from "react"

type LocationMode = "existing" | "new"


interface ToogleMapsProps {
    value: LocationMode;
    onChange: (mode: LocationMode) => void;

}

//Toggle input radio/ estado locationMode en el padre

export const ToogleMaps = ({value, onChange}: ToogleMapsProps) => {
    return(
        <div className="flex gap-4 my-4">
            <label className="flex intem-center gap-2 cursor-pointer">
                <input 
                type="radio"
                name="locationMode"
                value="existing"
                checked={value === "existing"}
                onChange={() => onChange("existing")}
                 />
                 Usar pista existente
            </label>

            <label className="flex intem-center gap-2 cursor-pointer">
                <input 
                type="radio"
                name="locationMode"
                value="new"
                checked={value === "new"}
                onChange={() => onChange("new")}
                 />
                 Crear pista nueva
            </label>


        </div>
    )

    




}