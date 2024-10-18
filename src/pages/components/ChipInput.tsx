import ClearIcon from '@mui/icons-material/Clear'
import Autocomplete from '@mui/material/Autocomplete'
import Chip from '@mui/material/Chip'
import TextField from '@mui/material/TextField'
import React from 'react'
export const ChipInput = ({
	onChange,
	label,
}: {
	onChange: any
	label: string
}) => {
	return (
		<Autocomplete
			multiple
			options={[]}
			id='tags-filled'
			freeSolo
			renderTags={(value: string[], getTagProps) => {
				try {
					const chips = value.map((option: string, index: number) => (
						<Chip
							variant='outlined'
							label={option}
							deleteIcon={<ClearIcon />}
							{...getTagProps({ index })}
						/>
					))
					onChange(value)
					return chips
				} catch (err) {}
			}}
			renderInput={(params) => (
				<TextField
					{...params}
					required
					label={label}
					margin='dense'
					fullWidth
					variant='standard'
				/>
			)}
		/>
	)
}
