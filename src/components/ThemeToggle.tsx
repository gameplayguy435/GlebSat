/* Credit to:
    Abbey Perini - https://dev.to/abbeyperini/toggle-dark-mode-in-react-28c9
    Chris Bongers - https://dev.to/chrisbongers/how-to-build-a-dark-mode-toggle-with-react-and-styled-components-2e18
*/
import { useColorScheme } from '@mui/material/styles';
import { useEffect, useState } from 'react';
import { setTheme } from '../assets/theme/AppTheme';
import '../assets/styles/Toggle.css';

const ThemeToggle = () => {
    const { mode, setMode } = useColorScheme();

    const [togClass, setTogClass] = useState('dark');
    const [isChecked, setIsChecked] = useState(true);
    let theme = localStorage.getItem('theme');

    const changeTheme = () => {
        if (theme === 'theme-dark') {
            setMode('light');
            setTheme('theme-light');
            setTogClass('light');
            setIsChecked(false);
        } else {
            setMode('dark');
            setTheme('theme-dark');
            setTogClass('dark');
            setIsChecked(true);
        }
    };

    useEffect(() => {
        if (theme === 'theme-light') {
            setTogClass('light');
            setIsChecked(false);
        } else {
            setTogClass('dark');
            setIsChecked(true);                 
        }
    }, [theme]);

    return (
        <div className="container--toggle">
            <input type="checkbox" id="toggle" className="toggle--checkbox" onChange={changeTheme} checked={isChecked} title="Toggle Theme" />
            <label htmlFor="toggle" className="toggle--label">
                <span className="toggle--label-background"></span>
            </label>
        </div>
    );
};

export default ThemeToggle;