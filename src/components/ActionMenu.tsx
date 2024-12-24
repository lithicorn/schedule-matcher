'use client';
import React, { useState } from 'react';
import html2canvas from 'html2canvas';
import { IconButton, Tooltip, Icon } from '@mui/material';
import { WbSunny, DarkMode, SaveAlt, Link, FileCopy, Check } from '@mui/icons-material';

MuiButton: {
  styleOverrides: {
    root: {
      lineHeight: 0
    }
  }
}

interface ActionMenuProps {
  toPic: React.RefObject<HTMLDivElement | null>;
}

const ActionMenu: React.FC<ActionMenuProps> = ({ toPic }) => {
  const [showAlert, setShowAlert] = useState(false);

  const saveCalendarAsImage = async () => {
    if (toPic.current) {
      const copyPic = toPic;
      const originalWidth = toPic.current.style.width;
      // toPic.current.style.width = '1920px'; // Mimic XL screen width

      const canvas = await html2canvas(toPic.current, {
        useCORS: true,
        allowTaint: true,
        scrollY: -window.scrollY,
      });

      toPic.current.style.width = originalWidth || '';
      const image = canvas.toDataURL('image/jpeg');
      const link = document.createElement('a');
      link.href = image;
      link.download = 'calendar-grid.jpg';
      link.click();
    }
  };

  const copyLink = () => {
    const currentUrl = window.location.href;
    navigator.clipboard.writeText(currentUrl) // Use writeText instead of ClipboardItem
      .then(() => {
        setShowAlert(true);
        setTimeout(() => setShowAlert(false), 2000);
      })
      .catch((error) => {
        console.error('Failed to copy link:', error);
      });
  };  

  const copyImageToClipboard = async () => {
    if (toPic.current) {
      const canvas = await html2canvas(toPic.current);
      canvas.toBlob((blob) => {
        if (blob) {
          navigator.clipboard.write([
            new ClipboardItem({
              'image/png': blob,
            }),
          ]);
          setShowAlert(true);
          setTimeout(() => setShowAlert(false), 2000);
        }
      });
    }
  };

  return (
    <div className="p-4 flex lg:flex-col flex-row justify-center items-center gap-1">
      {/* Save Calendar Button */}
      
      <div className="flex items-center justify-center w-full">
        <Tooltip title="Save Calendar as Image">
          <IconButton onClick={saveCalendarAsImage} aria-label="Save Calendar" color="primary">
            <SaveAlt />
          </IconButton>
        </Tooltip>
      </div>

      {/* Copy Link Button */}
      
      <div className="flex items-center justify-center w-full">
        <Tooltip title="Copy Link">
          <IconButton onClick={copyLink} aria-label="Copy Link" color="primary">
            <Link />
          </IconButton>
        </Tooltip>
      </div>
      {/* Copy Image to Clipboard Button */}
      
      <div className="flex items-center justify-center w-full">
        <Tooltip title="Copy Image to Clipboard">
          <IconButton onClick={copyImageToClipboard} aria-label="Copy Image" color="primary">
            <FileCopy />
          </IconButton>
        </Tooltip>
      </div>

      {/* Show check mark when action is completed */}
      {showAlert && (
        <div className="flex items-center justify-center w-full pointer-events-none cursor-default">
          <Tooltip title="done!">
            <IconButton aria-label="Check" color="primary">
              <Check />
            </IconButton>
          </Tooltip>
        </div>
      )}
    </div>
  );
};

export default ActionMenu;
