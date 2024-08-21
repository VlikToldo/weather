import { FC } from 'react';
import styles from './custom-loader.module.css'

const Loader: FC = () => {
  return (
    <div className={styles.loader}>
      <div className={styles.spinner}></div>
    </div>
  );
};

export default Loader;
