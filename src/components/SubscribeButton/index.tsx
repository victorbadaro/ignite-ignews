import styles from './styles.module.scss';

interface SubscribeButtonProps {
    priceID: string;
}

export function SubscribeButton({ priceID }: SubscribeButtonProps) {
    
    function handleSubscribe() {

    }
    
    return (
        <button
            type="button"
            className={styles.subscribeButton}
            onClick={handleSubscribe}
        >
            Subscribe now
        </button>
    );
}