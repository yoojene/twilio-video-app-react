import React, { useEffect, useState } from 'react';
import { S3ProviderListOutput, S3ProviderListOutputItem } from '@aws-amplify/storage';
import { Storage } from 'aws-amplify';
import { AmplifyS3Image } from '@aws-amplify/ui-react';
import styled from 'styled-components';
import useVideoContext from '../../hooks/useVideoContext/useVideoContext';
import { Grid } from '@material-ui/core';

const StyledS3Image = styled(AmplifyS3Image)`
  --height: 600px;
  --width: 320px;
`;
export default function SavedImageGallery() {
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
      {images?.map((img: any) => (
        // eslint-disable-next-line react/jsx-key
        <Grid item key={img.key}>
          <StyledS3Image imgKey={img.key}></StyledS3Image>
        </Grid>
      ))}
    </Grid>
  );
}
