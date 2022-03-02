import React, { useEffect, useState } from 'react';
import { S3ProviderListOutput, S3ProviderListOutputItem } from '@aws-amplify/storage';
import { Storage } from 'aws-amplify';
import { AmplifyS3Image } from '@aws-amplify/ui-react';
import styled from 'styled-components';
import useVideoContext from '../../hooks/useVideoContext/useVideoContext';
import { createStyles, Grid, makeStyles } from '@material-ui/core';
import format from 'date-fns/format';

const StyledS3Image = styled(AmplifyS3Image)`
  --height: 600px;
  --width: 320px;
`;
const useStyles = makeStyles(() =>
  createStyles({
    date: {
      // border: '1px solid black',
      marginBottom: '20px',
    },
  })
);

export default function SavedImageGallery() {
  const classes = useStyles();
  const [images, setImages] = useState<S3ProviderListOutput>([]);
  const { room } = useVideoContext();

  useEffect(() => {
    getImages();

    async function getImages() {
      try {
        const path = `${room?.name}/${room?.sid}/`;

        const allFiles = await Storage.list(path);

        let imageRes: S3ProviderListOutputItem[] = [];

        imageRes = allFiles.filter(
          f =>
            !f.key?.endsWith('txt') &&
            f.lastModified?.getDate() === new Date().getDate() &&
            f.lastModified.getMonth() === new Date().getMonth() &&
            f.lastModified.getFullYear() === new Date().getFullYear()
        );

        setImages(imageRes);
      } catch (err) {
        console.error(err);
      }
    }
  }, [images]);
  return (
    <Grid container direction="column">
      {images?.map((img: S3ProviderListOutputItem) => (
        <Grid item key={img.key}>
          <>
            <StyledS3Image imgKey={img.key}></StyledS3Image>
            <div className={classes.date}>{format(img.lastModified!, 'EEE dd/MM/yyyy HH:mm:ss')}</div>
          </>
        </Grid>
      ))}
    </Grid>
  );
}
